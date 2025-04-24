/**
 * @desc Client-side logic for category filtering.
 * @author RJS3c
 */

import CookieJar from "./cookie.min.mjs";

function add_selected(element) {
    /**
     * Adds the selected style to a given element.
     * @param {object} element The element to which to apply    
     *  selection style.
     */

    element.addClass("link-selected");
}

function remove_selected(element) {
    /**
     * Removes the selected style from a given element.
     * @param {object} element The element from which to remove
     *  the selection style.
     */

    element.removeClass("link-selected");
}

function show_all_list() {
    /**
     * Default case to show all posts regardless of category.
     */

    $("ul.post-list li").show();
}

function filter_list(needle) {
    /**
     * Filters list of posts by a specific category.
     * In this case, the data attribute 'category' in individual list
     *  items is the target.
     * @param {string} needle The category to filter by.
     */

    // First, reset all posts to show by default, so
    // that these can be re-filtered.
    show_all_list();

    $(`ul.post-list li[data-category!='${needle}']`).hide();
}

$("div.tag-link-col").on("click", function () {
    /**
     * Logic actuated when the 'All', 'Off-Sec' or
     * 'Def-Sec' filter is selected.
     */

    let target = $(this);
    let cookie_jar = new CookieJar(document.cookie); 

    switch (target.data("tag")) {

        case "defsec":
        case "offsec":

            cookie_jar.setCookie("category", target.data("tag"));

            // Hide posts not of concern. Opted to hide
            // so as to not resort to re-rendering list.
            filter_list(target.data("tag"));
            
            break;

        default:

            cookie_jar.setCookie("category", "all");

            // Defaults to 'All'.
            show_all_list(); break;
    }

    // Remove current selection to ensure exclusivity.
    remove_selected($(".tag-link-col"));

    // Add class onto target.
    add_selected($(this));
});

// Defaults to 'All' category if cookie not set.
$(function () {

    remove_selected($(".tag-link-col"));

    let cookie_jar = new CookieJar(document.cookie);

    if (!cookie_jar.cookieExists("category")) {

        // Set default cookie to 'All', and highlight
        // 'All' option.
        cookie_jar.setCookie("category", "all");

        add_selected($("#tag-link-all"));
        show_all_list();

    } else {

        let category = cookie_jar.getCookie("category").value;

        switch (category) {

            case "defsec":
            case "offsec":

                add_selected($(`#tag-link-${category}`));
                filter_list(category);
                
                break;

            default:

                add_selected($("#tag-link-all"));
                show_all_list();
        }
    }
});