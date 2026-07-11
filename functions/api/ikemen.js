export async function onRequest(context) {
    // 1. 获取你在 Cloudflare 后台配置的 Notion API 密钥
    const NOTION_API_KEY = context.env.NOTION_API_KEY; 
    
    // 2. 你的后宫机密名册 Database ID
    const DATABASE_ID = '39a897f4e1aa8012aa4dee074fa25905';

    try {
        if (!NOTION_API_KEY) {
            throw new Error("Cloudflare 环境变量中未找到 NOTION_API_KEY");
        }

        // 3. 向 Notion 官方发起真实的拉取请求
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Notion API 请求失败: ${response.status}`);
        }

        const rawData = await response.json();

        // 4. 清洗 Notion 臃肿的原始数据，提取我们要的 5 个精准字段
        const formattedData = rawData.results.map(page => {
            const props = page.properties;
            
            // 安全提取，防止某一列没填数据导致报错
            return {
                // 提取 Name (标题类型)
                Name: props.Name?.title?.[0]?.plain_text || "未命名",
                
                // 提取 Type (单选标签类型：皇贵妃、贵人等)
                Type: props.Type?.select?.name || "未知位分",
                
                // 提取 Desc (文本类型：评语)
                Desc: props.Desc?.rich_text?.[0]?.plain_text || "",
                
                // 提取 Tag (单选标签类型：なりたい自分 等)
                Tag: props.Tag?.select?.name || "",
                
                // 提取 Media (文件与媒体类型：照片地址)
                // 如果你传了图片，提取它的 URL；没传就是空字符串
                Media: props.Media?.files?.[0]?.file?.url || props.Media?.files?.[0]?.external?.url || ""
            };
        });

        // 5. 吐给你的 ike.html 前端
        return new Response(JSON.stringify(formattedData), {
            headers: { 
                "Content-Type": "application/json",
                "Cache-Control": "no-cache" // 确保每次刷新都能拉到 Notion 的最新数据
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}