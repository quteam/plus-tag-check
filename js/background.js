chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const params = Object.assign({ projectName: "", reposName: "", tag: "" }, request);

    fetch(`http://git.sankuai.com/rest/api/1.0/projects/${params.projectName}/repos/${params.reposName}/compare/diff?from=refs/heads/master&to=refs/tags/${params.tag}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            // console.log(res);
            if (res.diffs) {
                sendResponse({ diffCount: res.diffs.length });
            } else {
                sendResponse({ diffCount: 0 });
            }
        })
        .catch(function (err) {
            console.log(err);
            sendResponse({ diffCount: 0 });
        })
    return true;
});