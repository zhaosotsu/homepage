export async function onRequest(context) {
    const DB_ID = "39a897f4e1aa803285ead893d7c8215e";
    const TOKEN = context.env.NOTION_TOKEN;

    let allResults = [];
    let hasMore = true;
    let nextCursor = undefined;

    try {
        // 循环拉取所有页，直到没有下一页
        while (hasMore) {
            const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    start_cursor: nextCursor,
                    page_size: 100
                })
            });

            const data = await response.json();
            if (data.results) {
                allResults = allResults.concat(data.results);
            }
            
            hasMore = data.has_more;
            nextCursor = data.next_cursor;
        }

        // 清洗数据 (加上百科链接标识)
        const cleanData = allResults.map(page => {
            const p = page.properties;
            const getVal = (prop) => {
                if(!prop) return '';
                if(prop.type === 'title') return prop.title[0]?.plain_text || '';
                if(prop.type === 'rich_text') return prop.rich_text[0]?.plain_text || '';
                if(prop.type === 'number') return prop.number || '';
                if(prop.type === 'select') return prop.select?.name || '';
                return '';
            };
            return {
                Name: getVal(p.Name),
                Type: getVal(p.Types) || getVal(p.Type), // 兼容两种字段名
                Month: getVal(p.Month),
                Day: getVal(p.Day),
                URL: getVal(p.URL)
                Wiki: getVal(p.Wiki)
            };
        });

        return new Response(JSON.stringify(cleanData), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
