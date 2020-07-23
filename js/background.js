chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const params = Object.assign({ projectName: "", reposName: "", tag: "" }, request);

    fetch(`http://git.sankuai.com/rest/api/1.0/projects/${params.projectName}/repos/${params.reposName}/compare/diff?from=refs/heads/master&to=refs/tags/${params.tag}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            // console.log(res);
            if (res.diffs) {
                sendResponse({ code: 200, diffCount: res.diffs.length });
            } else {
                sendResponse({ code: 100, msg: "请求出错" });
            }
        })
        .catch(function (err) {
            console.log(err);
            sendResponse({ code: 101, msg: "请求出错！" });
        })
    return true;
});