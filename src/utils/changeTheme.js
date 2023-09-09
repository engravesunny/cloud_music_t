export const changeTheme = (theme) => {
    switch (theme) {
        case 'Dark Purple':
            toTheme("rgb(40, 36, 44)",
                "rgb(202, 183, 224)",
                "rgb(49, 44, 55)",
                "rgb(68, 63, 77)",
                "rgb(37, 35, 43)",
                "rgb(26, 24, 30)",
                "rgb(216, 196, 241)",
                "rgb(34, 31, 38)",
                "rgb(53,48,59");
            break;
        case 'Light Purple':
            toTheme("rgb(246, 243, 248)",
                "rgb(64, 43, 77)",
                "rgb(236, 233, 239)",
                "rgb(228, 219, 239)",
                "rgb(247, 240, 255)",
                "#fff",
                "rgb(159, 116, 231)",
                "rgb(249, 247, 249)",
                "rgb(240, 234, 247)");
            break;
        default:
            return false
    }
}

const changeRoot = (key, value) => {
    document.documentElement.style.setProperty(key, value);
}

const toTheme = (bgGlobal, fontGlobal, sidebarHover, sidebarAcive, songHover, songLi, clickEnable, innerBody, suggestBg) => {
    changeRoot('--bg-color-global', bgGlobal);
    changeRoot('--font-color-global', fontGlobal);
    changeRoot('--siderbar-hover-color', sidebarHover);
    changeRoot('--siderbar-active-color', sidebarAcive);
    changeRoot('--song-hover-color', songHover);
    changeRoot('--song-li-color', songLi);
    changeRoot('--click-enable-color', clickEnable);
    changeRoot('--inner-body-color', innerBody);
    changeRoot('--suggest-bg-color', suggestBg);
}