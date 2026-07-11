export async function onRequest(context) {
    // 确保你在 Cloudflare 后台设置了这个环境变量
    const NOTION_API_KEY = context.env.NOTION_API_KEY; 
    const DATABASE_ID = '39a897f4e1aa8012aa4dee074fa25905';

    try {
        // 1. 发起请求获取 Notion 数据
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Notion API 响应错误: ${response.status}`);
        }

        const rawData = await response.json();

        // 2. 清洗数据：将 Notion 复杂的格式转为你 HTML 能认出的格式
        const formattedData = rawData.results.map(page => {
            const props = page.properties;
            return {
                Name: props.Name?.title?.[0]?.plain_text || "未命名",
                Type: props.Type?.select?.name || "未知位分",
                Desc: props.Desc?.rich_text?.[0]?.plain_text || "",
                Tag: props.Tag?.select?.name || "",
                Media: props.Media?.files?.[0]?.file?.url || props.Media?.files?.[0]?.external?.url || ""
            };
        });

        // 3. 返回纯数组，直接给前端使用
        return new Response(JSON.stringify(formattedData), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
