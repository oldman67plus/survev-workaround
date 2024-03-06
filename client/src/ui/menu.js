import $ from "jquery";
import { device } from "../device";
import { helpers } from "../helpers";
import { MenuModal } from "./menuModal";

function createToast(text, container, parent, event) {
    const copyToast = $("<div/>", {
        class: "copy-toast",
        html: text
    });
    container.append(copyToast);
    copyToast.css({
        left: event.pageX - parseInt(copyToast.css("width")) / 2,
        top: parent.offset().top
    });
    copyToast.animate(
        {
            top: "-=25",
            opacity: 1
        },
        {
            queue: false,
            duration: 300,
            complete: function() {
                $(this).fadeOut(250, function() {
                    $(this).remove();
                });
            }
        }
    );
}
function setupModals(inputBinds, inputBindUi) {
    const r = $("#start-menu");
    $("#btn-help").click(() => {
        const e = $("#start-help");
        r.addClass("display-help");
        const t = r.css("height");
        e.css("display", "block");
        r.animate(
            {
                scrollTop: t
            },
            1000
        );
        return false;
    });
    const teamMobileLink = $("#team-mobile-link");
    const teamMobileLinkDesc = $("#team-mobile-link-desc");
    const teamMobileLinkWarning = $("#team-mobile-link-warning");
    const teamMobileLinkInput = $("#team-link-input");
    const u = $("#social-share-block");
    const g = $("#news-block");

    // Team mobile link
    $("#btn-join-team").click(() => {
        $("#server-warning").css("display", "none");
        teamMobileLinkInput.val("");
        teamMobileLink.css("display", "block");
        teamMobileLinkDesc.css("display", "block");
        teamMobileLinkWarning.css("display", "none");
        r.css("display", "none");
        g.css("display", "none");
        u.css("display", "none");
        $("#right-column").css("display", "none");
        return false;
    });
    $("#btn-team-mobile-link-leave").click(() => {
        teamMobileLink.css("display", "none");
        teamMobileLinkInput.val("");
        r.css("display", "block");
        g.css("display", "block");
        u.css("display", "block");
        $("#right-column").css("display", "block");
        return false;
    });

    // Auto submit link or code on enter
    $("#team-link-input").on("keypress", function(e) {
        if ((e.which || e.keyCode) === 13) {
            $("#btn-team-mobile-link-join").trigger("click");
            $(this).blur();
        }
    });

    // Blur name input on enter
    $("#player-name-input-solo").on("keypress", function(e) {
        if ((e.which || e.keyCode) === 13) {
            $(this).blur();
        }
    });

    // Scroll to name input on mobile
    if (device.mobile && device.os != "ios") {
        $("#player-name-input-solo").on("focus", function() {
            if (device.isLandscape) {
                const height = device.screenHeight;
                const offset = height <= 282 ? 18 : 36;
                document.body.scrollTop = $(this).offset().top - offset;
            }
        });
        $("#player-name-input-solo").on("blur", () => {
            document.body.scrollTop = 0;
        });
    }

    // Modals
    const startBottomRight = $("#start-bottom-right");
    const startTopLeft = $("#start-top-left");
    const startTopRight = $("#start-top-right");

    // Keybind Modal
    const modalKeybind = new MenuModal($("#ui-modal-keybind"));
    modalKeybind.onShow(() => {
        startBottomRight.fadeOut(200);
        startTopRight.fadeOut(200);

        // Reset the share section
        $("#ui-modal-keybind-share").css("display", "none");
        $("#keybind-warning").css("display", "none");
        $("#ui-modal-keybind-list").css("height", "420px");
        $("#keybind-code-input").html("");
        inputBindUi.refresh();
    });
    modalKeybind.onHide(() => {
        startBottomRight.fadeIn(200);
        startTopRight.fadeIn(200);
        inputBindUi.cancelBind();
    });
    $(".btn-keybind").click(() => {
        modalKeybind.show();
        return false;
    });

    // Share button
    $(".js-btn-keybind-share").click(() => {
        // Toggle the share screen
        if (
            $("#ui-modal-keybind-share").css("display") == "block"
        ) {
            $("#ui-modal-keybind-share").css("display", "none");
            $("#ui-modal-keybind-list").css("height", "420px");
        } else {
            $("#ui-modal-keybind-share").css("display", "block");
            $("#ui-modal-keybind-list").css("height", "275px");
        }
    });

    // Copy keybind code
    $("#keybind-link, #keybind-copy").click((e) => {
        createToast("Copied!", modalKeybind.selector, $("#keybind-link"), e);
        const t = $("#keybind-link").html();
        helpers.copyTextToClipboard(t);
    });

    // Apply keybind code
    $("#btn-keybind-code-load").on("click", (e) => {
        const code = $("#keybind-code-input").val();
        $("#keybind-code-input").val("");
        const success = inputBinds.fromBase64(code);
        $("#keybind-warning").css("display", success ? "none" : "block");
        if (success) {
            createToast(
                "Loaded!",
                modalKeybind.selector,
                $("#btn-keybind-code-load"),
                e
            );
            inputBinds.saveBinds();
        }
        inputBindUi.refresh();
    });

    // Settings Modal
    const modalSettings = new MenuModal($("#modal-settings"));
    modalSettings.onShow(() => {
        startBottomRight.fadeOut(200);
        startTopRight.fadeOut(200);
    });
    modalSettings.onHide(() => {
        startBottomRight.fadeIn(200);
        startTopRight.fadeIn(200);
    });
    $(".btn-settings").click(() => {
        modalSettings.show();
        return false;
    });
    $(".modal-settings-text").click(function(e) {
        const checkbox = $(this).siblings("input:checkbox");
        checkbox.prop("checked", !checkbox.is(":checked"));
        checkbox.trigger("change");
    });

    // Hamburger Modal
    const modalHamburger = new MenuModal($("#modal-hamburger"));
    modalHamburger.onShow(() => {
        startTopLeft.fadeOut(200);
    });
    modalHamburger.onHide(() => {
        startTopLeft.fadeIn(200);
    });
    $("#btn-hamburger").click(() => {
        modalHamburger.show();
        return false;
    });
    $(".modal-body-text").click(function() {
        const checkbox = $(this).siblings("input:checkbox");
        checkbox.prop("checked", !checkbox.is(":checked"));
        checkbox.trigger("change");
    });
    $("#force-refresh").click(() => {
        window.location.href = `/?t=${Date.now()}`;
    });
    /* var S = new h(l("#modal-notification")),
  v = (function () {
      return "WebSocket" in window
          ? d.Y()
              ? "ie" == c.browser
                  ? 'Please use the <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">Chrome browser</a> for a better playing experience!<br><br>¡Usa el <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">navegador Chrome</a> para una mejor experiencia de juego!<br><br><a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">구글 크롬</a> 브라우저로이 게임을 즐겨보세요.'
                  : void 0
              : 'Please use the <a href="https://surviv.io" target="_blank">official surviv.io site</a> for a better playing experience!'
          : 'WebSockets are required to play.<br><br>Please use the <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">Chrome browser</a> for a better playing experience!';
  })();
if (
  (v &&
      (S.selector.find(".modal-body-text").html(v),
      S.show()),
  m.Z(),
  window.adsBlocked)
) {
  var k = document.getElementById(
      "main-med-rect-blocked",
  );
  k && (k.style.display = "block");
  var z = document.getElementById(
      "survivio_300x250_main",
  );
  z && (z.style.display = "none");
  var I = document.getElementById("surviv-io_300x250");
  I && (I.style.display = "none");
}
window.aiptag &&
  ((window.aiptag.gdprConsent = window.cookiesConsented),
  (window.aiptag.consented = window.cookiesConsented)); */
}
function onResize() {
    // Add styling specific to safari in browser
    if (device.os == "ios") {
        // iPhone X+ specific
        if (device.model == "iphonex") {
            if (device.isLandscape) {
                $(".main-volume-slider").css("width", "90%");
            } else {
                $(".main-volume-slider").css("width", "");
            }
        } else if (!window.navigator.standalone) {
            if (device.isLandscape) {
                $("#start-main-center").attr("style", "");
                $("#modal-customize .modal-content").attr(
                    "style",
                    ""
                );
            } else {
                $("#modal-customize .modal-content").css({
                    transform: "translate(-50%, -50%) scale(0.45)",
                    top: "38%"
                });
            }
        }
    }
    if (device.tablet) {
        // Temporarily remove the youtube links
        $("#featured-youtuber").remove();
        $(".btn-youtube").remove();
    }
    if (device.touch) {
        // Remove full screen option from main menu
        $(".btn-start-fullscreen").css("display", "none");
    } else {
        $(".btn-start-fullscreen").css("display", "block");
    }
    // Set keybind button styling
    $(".btn-keybind").css(
        "display",
        device.mobile ? "none" : "inline-block"
    );
}
function applyWebviewStyling(isTablet) {
    // For webviews, we only want to display the team code, not the url.
    // We'll reuse the copy-url element to display the code.
    const hamburgerMenu = $("#modal-hamburger-bottom");
    hamburgerMenu.children().slice(-3).remove();
    hamburgerMenu.children().last().removeClass("footer-after");
    $("#invite-link-text").attr("data-l10n", "index-invite-code");
    $("#team-code-text").css("display", "none");
    $("#invite-code-text").css("display", "none");
    $("#team-hide-url").css("display", "none");
    $(".btn-download-ios").css("display", "none");
    $(".btn-download-android").css("display", "none");
    $("#mobile-download-app").css("display", "none");
    $("#start-bottom-middle").css("display", "none");
    if (!isTablet) {
        $("#btn-help").css("display", "none");
        $("#news-block, #start-menu").css({
            height: 186
        });
        $("#team-menu").css({
            height: 186,
            padding: 10
        });
    }
}
function applyMobileBrowserStyling(isTablet) {
    $("#team-hide-url").css("display", "none");
    if (isTablet) {
        $("#start-bottom-middle").addClass(
            "start-bottom-middle-tablet"
        );
    }
    if (device.os == "android") {
        $(".btn-download-android").css("display", "block");
        $(".btn-download-ios").css("display", "none");
    } else if (device.os == "ios") {
        $(".btn-download-ios").css("display", "block");
        $(".btn-download-android").css("display", "none");
    }
    $("#mobile-download-app").css("display", "block");
}

export default {
    setupModals,
    onResize,
    applyWebviewStyling,
    applyMobileBrowserStyling
};