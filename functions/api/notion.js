export async function onRequest(context) {
    // 你的表格 ID，这是公开的没关系
    const DB_ID = "39a897f4e1aa803285ead893d7c8215e";
    
    // 【核心安全修改】从 Cloudflare 后台安全读取环境变量，代码里不出现任何密钥！
    const TOKEN = context.env.NOTION_TOKEN;

    if (!TOKEN) {
        return new Response(JSON.stringify({ error: "服务器环境变量未配置 NOTION_TOKEN" }), { status: 500 });
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data.error) {
            return new Response(JSON.stringify({ error: data.message }), { status: 500 });
        }

        const cleanData = data.results.map(page => {
            const p = page.properties;
            const getVal = (prop) => {
                if(!prop) return '';
                if(prop.type === 'title') return prop.title[0]?.plain_text || '';
                if(prop.type === 'rich_text') return prop.rich_text[0]?.plain_text || '';
                if(prop.type === 'number') return prop.number || '';
                if(prop.type === 'select') return prop.select?.name || '';
                if(prop.type === 'multi_select') return prop.multi_select.map(s => s.name).join(' / ') || '';
                if(prop.type === 'url') return prop.url || '';
                return '';
            };
            return {
                Name: getVal(p.Name),
                Type: getVal(p.Types), 
                Month: getVal(p.Month),
                Day: getVal(p.Day),
                URL: getVal(p.URL)
            };
        });

        return new Response(JSON.stringify(cleanData), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
