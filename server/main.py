from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from PIL import Image
from io import BytesIO
import base64
import os
import platform
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 OpenAI 客户端
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 限制图片最大边长
MAX_IMAGE_SIZE = 1024

# 更通用的提示词，更贴近 ChatGPT 的视觉理解方式
ANALYSIS_PROMPT = (
    "你是全球文物鉴定专家，请根据图片分析物品的类型、用途、文化归属（请严格只给出概率最高的一个文化归属)，年代"
    "并通过物体包浆颜色工艺判断真伪（0-100%）"
    "请用中文总结风格、判断依据与真伪概率"
)


def resize_image_if_needed(image_bytes: bytes) -> bytes:
    with Image.open(BytesIO(image_bytes)) as img:
        # 检查是否需要缩放
        if max(img.size) > MAX_IMAGE_SIZE:
            img.thumbnail((MAX_IMAGE_SIZE, MAX_IMAGE_SIZE))  # 等比例缩放
            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=95, optimize=False)
            return buffer.getvalue()
        else:
            return image_bytes  # 原图足够小，直接返回



# 在分析函数中预留：
def find_similar_images_future(image_bytes):
    # 未来实现：图像向量 → Faiss 查询 → 返回相似图标签/路径
    return None  # 现在先不启用



@app.post("/api/analyze")
async def analyze(images: List[UploadFile] = File(...)):
    try:
        image_bytes_list = []
        for image in images:
            content = await image.read()
            image_bytes_list.append(content)
        
        # 这里调用你写的分析函数，传入图片字节列表
        analysis_result = await analyze_multiple_images(image_bytes_list)

        return JSONResponse({"result": analysis_result})
    except Exception as e:
        return JSONResponse({"result": f"服务器处理失败: {str(e)}"}, status_code=500)


#TEST_PROMPT= (
 #   f"我刚刚调用了你的API，并发送了 {len(list_of_image_bytes)} 张图片。"
#    f"请确认你是否收到了这些图片，并简单描述你收到了几张。"
#)

# 多图分析
async def analyze_multiple_images(list_of_image_bytes: List[bytes]) -> str:
    content = [{"type": "text", "text": ANALYSIS_PROMPT}]

    for image_bytes in list_of_image_bytes:
        base64_img = base64.b64encode(image_bytes).decode("utf-8")
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{base64_img}"}
        })

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": content}],
            max_tokens=1500,
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"调用 OpenAI API 失败: {str(e)}"


# 测试开始
def get_desktop_path() -> str:
    if platform.system() == "Windows":
        return os.path.join(os.environ["USERPROFILE"], "Desktop")
    else:
        return os.path.join(os.path.expanduser("~"), "Desktop")

@app.post("/resize_image")
async def resize_image(file: UploadFile = File(...)):
    try:
        original_bytes = await file.read()
        resized_bytes = resize_image_if_needed(original_bytes)

        output_filename = f"resized_{file.filename.rsplit('.', 1)[0]}.jpg"
        output_path = os.path.join(get_desktop_path(), output_filename)

        with open(output_path, "wb") as f:
            f.write(resized_bytes)

        return {
            "message": "图片已成功缩放并保存到桌面",
            "output_path": output_path
        }
    except Exception as e:
        return {"error": str(e)}
#测试结束


# 接口入口
@app.post("/analyze_multiple")
async def analyze_multiple_images_endpoint(files: List[UploadFile] = File(...)):
    image_bytes_list = [await file.read() for file in files]
    if not image_bytes_list:
        return {"error": "未上传任何图片"}
    
    result = await analyze_multiple_images(image_bytes_list)
    return {"result": result}

# 单图分析（保留，备用）
async def analyze_one_image(image_bytes: bytes) -> str:
    base64_img = base64.b64encode(image_bytes).decode("utf-8")
    content = [
        {"type": "text", "text": ANALYSIS_PROMPT},
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_img}"}},
    ]
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": content}],
            max_tokens=1500,
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"调用 OpenAI API 失败: {str(e)}"


# 根路径用于测试服务是否可用
@app.get("/")
def root():
    return {"msg": "FastAPI server is running."}
