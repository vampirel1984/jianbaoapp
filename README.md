# 🏺 鉴宝应用完整项目

这是一个完整的古董文物鉴定应用项目，包含：
- **Next.js Web应用** (app目录)
- **Python FastAPI后端** (server目录) 
- **React Native移动应用** (MyApp目录)

## 项目结构

```
jianbaoapp_clean/
├── app/                    # Next.js前端应用
│   ├── app/               # App Router页面
│   ├── public/            # 静态资源
│   ├── package.json       # 依赖配置
│   └── *.config.*         # 配置文件
├── server/                # Python后端API
│   ├── main.py           # FastAPI主程序
│   └── requirements.txt   # Python依赖
├── MyApp/                 # React Native移动应用
│   ├── src/              # 源代码
│   ├── android/          # Android配置
│   ├── ios/              # iOS配置
│   └── *.json            # 配置文件
└── README.md             # 本文件
```

## 快速开始

### 1. Next.js Web应用

```bash
cd app
npm install
npm run dev
```

访问: http://localhost:3000

### 2. Python后端服务

```bash
cd server
pip install -r requirements.txt

# 创建 .env 文件并添加OpenAI API密钥
echo "OPENAI_API_KEY=your_api_key_here" > .env

python main.py
```

访问: http://localhost:8000

### 3. React Native移动应用

```bash
cd MyApp
npm install

# Android
npm run android

# iOS (仅macOS)
npm run ios
```

## 环境要求

### Web应用 (app/)
- Node.js >= 18
- npm 或 yarn

### 后端服务 (server/)
- Python >= 3.8
- pip
- OpenAI API Key

### 移动应用 (MyApp/)
- Node.js >= 18
- React Native CLI
- Android Studio (Android开发)
- Xcode (iOS开发，仅macOS)

## 功能特性

- 📱 多平台支持：Web、Android、iOS
- 🔍 AI智能识别古董文物
- 📸 图片上传和处理
- 💰 价值评估
- 🎨 现代化UI设计

## 注意事项

1. **API密钥**: 后端需要配置OpenAI API密钥
2. **权限**: 移动应用需要相机和存储权限
3. **依赖**: 确保安装所有必要的开发环境
4. **端口**: 默认端口 - Web:3000, API:8000

## 部署说明

### Web应用部署
```bash
cd app
npm run build
npm start
```

### 后端部署
```bash
cd server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 移动应用打包
```bash
cd MyApp
# Android APK
npx react-native build-android --mode=release

# iOS (需要开发者账号)
npx react-native build-ios --mode=release
```

## 支持

如有问题，请检查：
1. 所有依赖是否正确安装
2. 环境变量是否正确配置
3. 端口是否被占用
4. 权限是否正确设置
