
function checkTagChange() {
    let tempTag = "";
    setInterval(() => {
        if (location.hash.indexOf("/release/build/detail/") > 0) {
            const $env = document.querySelector(".tplName span");
            const $select = document.querySelector(".code-set-select input");
            const $ipt = document.querySelector(".code-set-input input");
            if (!$env || !$select || !$ipt) {
                // console.log("构建任务页找不到元素");
                return;
            }
            if ($env.textContent !== "prod") {
                // console.log("不是 prod 环境");
                return;
            }
            if ($select.value !== "tag") {
                // console.log("没有选择 tag");
                tempTag = "";
                cleanTips();
                return;
            }
            if ($ipt.value === "" || $ipt.value === tempTag) {
                // console.log("没有选择 tag，或 tag 重复");
                return;
            }

            if (!checkTagRules($ipt.value)) {
                // console.log("tag 不符合规则")
                pageAddTips("不是r-tag");
                tempTag = "";
                return;
            }

            tempTag = $ipt.value;
            isLatestTag(tempTag);
        } else {
            // console.log("不是构建任务页");
            tempTag = "";
        }
    }, 500)
}

// 检测 tag 规则
function checkTagRules(tag) {
    return /^r-/.test(tag)
}

// 检测最新 tag
function isLatestTag(tag) {
    const params = Object.assign({ tag }, getProject());
    chrome.runtime.sendMessage(
        params,
        function (response) {
            cleanTips();
            if (response.code !== 200) {
                pageAddTips("tag检查失败,请重试");
                return;
            }

            if (response.diffCount > 0) {
                pageAddTips("不是最新的r-tag");
            }
        })
}

// 获取项目名称
function getProject() {
    const $repo = document.querySelector(".code-repo");
    if ($repo) {
        const result = $repo.href.match(/projects\/(.*)\/repos\/(.*)\//)
        if (result.length >= 3) {
            return {
                projectName: result[1],
                reposName: result[2],
            }
        }
    }
    return {
        projectName: "",
        reposName: "",
    }
}

// 页面增加提示
function pageAddTips(tipsText) {
    const $ipt = document.querySelector(".code-set-input input");
    if ($ipt) {
        const $parent = $ipt.parentElement;
        let $tips = document.querySelector("#check-tag-tips");
        if (!$tips) {
            $tips = document.createElement("div");
            $tips.id = "check-tag-tips";
            $tips.setAttribute("style", "position:absolute;right:5px;top:0;color:rgba(255,0,0,0.8)");
            $parent.appendChild($tips);
        }
        $tips.innerText = tipsText;

        $ipt.style.background = "rgba(255,0,0,0.2)";
    }
}

// 清除样式
function cleanTips() {
    const $ipt = document.querySelector(".code-set-input input");
    const $tips = document.querySelector("#check-tag-tips");
    if ($ipt && $tips) {
        $ipt.removeAttribute("style");
        $ipt.parentElement.removeChild(document.querySelector("#check-tag-tips"));
    }
}

checkTagChange();