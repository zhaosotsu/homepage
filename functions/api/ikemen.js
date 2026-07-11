export async function onRequest(context) {
    const NOTION_API_KEY = context.env.NOTION_API_KEY;
    const DATABASE_ID = '39a897f4e1aa8012aa4dee074fa25905';

    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        // 如果 API 报错，把错误信息吐出去
        if (!response.ok) {
            return new Response(JSON.stringify({ error: data }), { status: 500 });
        }

        const formattedData = data.results.map(page => ({
            Name: page.properties.Name?.title?.[0]?.plain_text || "未命名",
            Type: page.properties.Type?.select?.name || "未知位分",
            Desc: page.properties.Desc?.rich_text?.[0]?.plain_text || "",
            Tag: page.properties.Tag?.select?.name || "",
            Media: page.properties.Media?.files?.[0]?.file?.url || ""
        }));

        return new Response(JSON.stringify(formattedData), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
