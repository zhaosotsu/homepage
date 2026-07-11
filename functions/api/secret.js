export async function onRequest(context) {
    try {
        const { searchParams } = new URL(context.request.url);
        const password = searchParams.get('password');

        if (password !== "zhouyan") {
            return new Response(JSON.stringify({ error: "身份验证失败，请核对密钥。" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const secretVault = [
            { "m": 1, "d": 21, "n": "%E9%87%91%E7%8E%89%E5%A8%87%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 1, "d": 26, "n": "%E9%87%91%E4%BD%B3%E9%9C%9B%20%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 1, "d": 28, "n": "%E5%8D%A2%E4%BD%B3%E9%9B%AF%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 2, "d": 3, "n": "%E4%BB%BB%E5%AD%90%E4%B8%B0%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 3, "d": 4, "n": "%E3%83%AA%E3%82%AA%E3%82%B9%E3%83%9C%E3%83%BC%E3%82%A4%E3%83%95%E3%83%A5%E3%83%AC%E3%83%B3%E3%83%89%E6%97%A5%20(Pride%E6%97%A5%E8%AE%B0)%20%2F%20%E8%91%A3%E5%AD%90%E8%B1%AA%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 3, "d": 25, "n": "%E9%83%AD%E6%A2%A6%E7%A5%A5%E8%AF%9E%E7%94%9F%E6%97%A5%20%2F%20%E3%83%AF%E3%83%B3%E3%83%AB%E3%83%BC%E3%83%A0%E3%83%BB%E3%83%87%E3%82%A3%E3%82%B9%E3%82%B3%E3%83%BB%E8%AE%B0%E5%BF%B5%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 4, "d": 1, "n": "%E6%84%9A%E4%BA%BA%E8%8A%82%20%2F%20%E5%90%B4%E4%BE%9D%E5%A6%8D%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 4, "d": 17, "n": "%E7%8E%8B%E5%98%89%E8%BD%A9%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 5, "d": 1, "n": "%E5%9B%BD%E9%99%85%E5%8A%B3%E5%8A%A8%E8%8A%82%20%2F%20%E5%88%98%E6%A1%90%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 5, "d": 3, "n": "%E5%91%A8%E5%A5%95%E5%B8%8C%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 6, "d": 22, "n": "%E4%BA%8B%E5%8F%98%E5%93%80%E6%85%BC%E6%97%A5%20%2F%20%E9%99%88%E5%BF%83%E6%85%A0%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 6, "d": 23, "n": "%E5%85%B3%E8%8B%A5%E6%B6%B5%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 6, "d": 29, "n": "%E6%9B%B9%E6%A2%A6%E5%A6%8D%20%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 7, "d": 1, "n": "%E9%A6%99%E6%B8%AF%E5%9B%9E%E5%BD%92%E7%BA%AA%E5%BF%B5%E6%97%A5%20%2F%20%E5%BB%BA%E5%85%9A%E8%8A%82%20%2F%20%E9%99%88%E9%A1%BE%E6%96%B9%E8%AF%9E%E7%94%9F%E6%97%A5%20%2F%20%E6%9A%91%E5%81%87", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 7, "d": 6, "n": "%E6%9D%8E%E8%8B%A5%E5%A5%B4%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 7, "d": 29, "n": "%E5%BE%90%E6%BA%90%E9%83%B4%E8%AF%9E%E7%94%9F%E6%97%A5%20%2F%20%E7%81%AB%E6%8A%8A%E8%8A%82", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 8, "d": 14, "n": "%E6%88%B4%E8%8A%AC%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 8, "d": 15, "n": "Spending%20all%20my%20time%20%2F%20Future%20Pop%E3%83%BB%E8%AE%B0%E5%BF%B5%E6%97%A5%20%2F%20%E7%8E%8B%E6%A2%93%E6%B5%85%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 8, "d": 21, "n": "%E7%8E%8B%E5%A3%AE%E6%9C%88%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 8, "d": 26, "n": "%E6%BD%98%E8%87%B4%E6%84%8F%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 9, "d": 29, "n": "%E6%9D%8E%E9%9D%99%E5%AE%9C%E8%AF%9E%E7%94%9F%E6%97%A5%20%2F%20%E8%B5%B5%E6%99%AF%E8%B4%A4%E8%AF%9E%E7%94%9F%E6%97%A5%20%2F%20%E4%B8%AD%E6%97%A5%E5%9B%BD%E4%BA%A4%E6%AD%A3%E5%B8%B8%E5%8C%96%E5%91%A8%E5%B9%B4%E7%BA%AA%E5%BF%B5%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 11, "d": 1, "n": "%E5%AE%89%E6%A5%9A%E6%98%95%E8%AF%9E%E7%94%9F%E6%97%A5%20%2F%20%E5%BD%BC%E6%B0%8F%E5%8B%9F%E9%9B%86%E4%B8%AD%E3%83%BB%E8%AE%B0%E5%BF%B5%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 11, "d": "11日左右", "n": "%E9%83%AD%E6%A2%A6%E7%A5%A5%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 11, "d": 25, "n": "%E5%91%A8%E5%B7%B2%E7%AB%A5%E8%AF%9E%E7%94%9F%E6%97%A5%20%2F%20SID%20%E8%AE%B0%E5%BF%B5%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" },
            { "m": 12, "d": 16, "n": "%E6%9D%A8%E7%9A%93%E7%85%9C%E8%AF%9E%E7%94%9F%E6%97%A5", "t": "tag-perf", "tn": "クラメ達诞生日" }
        ];

        return new Response(JSON.stringify(secretVault), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
