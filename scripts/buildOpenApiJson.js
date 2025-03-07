import axios from "axios";
import fs from "fs"
import {configDotenv} from "dotenv";

configDotenv({
    path: [
        ".env.development",
        ".env.development.local",
        ".env.production",
        ".env.production.local",
        ".env.local",
        ".env"
    ]
})

console.log("[ENV] OPENAPI_DOC_JSON_URL:", process.env.OPENAPI_DOC_JSON_URL)


const OPENAPI_DOC_JSON_URL = process.env.OPENAPI_DOC_JSON_URL
console.log("OPENAPI_DOC_JSON_URL:", OPENAPI_DOC_JSON_URL)


if (!OPENAPI_DOC_JSON_URL) console.error("OPENAPI_DOC_JSON_URL is not defined");


function writeFile(filePath, data) {
    fs.writeFile(`./scripts/${filePath}`, data, (err) => {
        if (err) {
            console.error('写入文件失败:', err);
        } else {
            console.log(`已写入 ${filePath}`);
        }
    });
}

async function downloadFile() {
    try {
        const response = await axios.get(OPENAPI_DOC_JSON_URL);  // 获取响应数据[3](@ref)
        const jsonData = response.data;

        // 保存到本地文件
        writeFile('OpenAPI.json', JSON.stringify(jsonData, null, 2))
        return jsonData;  // 直接返回变量
    } catch (error) {
        console.error('下载失败:', error.message);
    }
}


function formatOperationIds(spec) {
    const operationIds = new Set();
    const paths = spec.paths || {};

    // 深拷贝原始对象避免污染
    const processedSpec = JSON.parse(JSON.stringify(spec));

    Object.keys(paths).forEach(path => {
        Object.keys(paths[path]).forEach(method => {
            if (!['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) return;

            const operation = processedSpec.paths[path][method];
            let baseId = formatOperationId(method, path);
            let finalId = baseId;
            let counter = 1;

            // 生成唯一ID
            while (operationIds.has(finalId)) {
                finalId = `${baseId}_${counter++}`;
            }
            operationIds.add(finalId);

            // 保留原始ID
            if (operation.operationId) {
                operation['x-original-id'] = operation.operationId;
            }
            operation.operationId = finalId;
        });
    });

    return processedSpec;

    function formatOperationId(method, path) {
        // 处理路径参数并标准化路径
        let formatted = path
            .replace(/{(\w+)}/g, '_$1')       // 替换路径参数
            .replace(/[^\w\u4e00-\u9fa5]/g, '_') // 替换非单词和中文字符
            .replace(/^_+|_+$/g, '')          // 去除首尾下划线
            .replace(/_+/g, '_');             // 合并连续下划线

        return `${method.toLowerCase()}_${formatted}`;
    }
}


function removeDuplicatePrimitives(obj) {
    if (Array.isArray(obj)) {
        const seen = new Set();
        const newArray = [];
        for (const item of obj) {
            if (isPrimitive(item)) {
                // 基本类型去重
                if (!seen.has(item)) {
                    seen.add(item);
                    newArray.push(item);
                }
            } else {
                // 非基本类型递归处理
                newArray.push(removeDuplicatePrimitives(item));
            }
        }
        return newArray;
    }

    if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = removeDuplicatePrimitives(obj[key]);
            }
        }
        return newObj;
    }

    return obj;

    function isPrimitive(value) {
        return (
            (typeof value !== 'object' && typeof value !== 'function') ||
            value === null
        );
    }
}

downloadFile()
    .then(jsonData => {
        const formattedData = formatOperationIds(jsonData);
        const cleanedData = removeDuplicatePrimitives(formattedData);
        writeFile('OpenAPI_postprocess.json', JSON.stringify(cleanedData, null, 2))
    });

