# ENTRA — QA smoke test

Date: 2026-09-14

## Scope checked
- 15 public HTML pages
- shared header/topbar/mega-menu targets
- local CSS/JS/image/font references
- internal file + anchor links
- duplicate HTML ids
- JavaScript syntax (`node --check`)
- CSS parsing (PostCSS)
- footer logo consistency

## Passed
- 15/15 pages contain the new ENTRA footer logo.
- 0 old footer logos remain.
- 0 missing local assets.
- 0 duplicate ids after cleanup.
- 0 broken normal internal file/anchor links.
- 0 broken targets in the shared product mega-menu.
- All JavaScript files pass syntax check.
- All CSS files parse successfully.

## Cleanup made during QA
- Replaced old footer logo on all pages with the current ENTRA vector logo.
- Removed accidental duplicate contact sections on Cloud and Colocation pages.
- Removed duplicate `id="top"` values on Dedicated, Mail and VPS.
- Added a real `#top` anchor to the homepage so “Наверх” works.

## Front-end interactions present
- Shared desktop/mobile menu logic and mega-menu switching.
- Direct Mail navigation and product subnavigation.
- Shared product search dialog.
- Domain search/filter UI (demo availability data).
- Hosting billing toggle and WordPress/1C switch.
- Dedicated filters, “show more”, request modal, FAQ.
- Mail request modal and FAQ.
- Services request modal and anchor navigation.
- VPN request modal and FAQ.
- Knowledge-base live filtering/search.
- Demo forms on Development and Partnership pages.

## Not launch-ready / still demo
1. Forms do not send to CRM/email/backend yet; they are demo handlers.
2. Domain availability/prices/order flow are not connected to WHMCS/registrar APIs.
3. Checkout/client-area/billing integration is not connected to the custom frontend yet.
4. News: 2 “Подробнее” links are placeholders (`#`) because article pages are not built yet.
5. Knowledge base: 5 article links are placeholders (`#`) because article detail pages are not built yet.
6. Language switcher does not translate the whole site yet; it only emits a language-change event (homepage map labels react to it).
7. Footer legal items (Terms, Privacy, Company details, Cookie) still open placeholder content.
8. Shared “Найти решение” is a compact predefined product list, not full-text site search.
9. Several commercial values are still design/mock values and should be synchronized with final billing/product data before launch.

## Next recommended QA/integration order
1. CRM/email submission for all forms.
2. WHMCS + domain registrar/API + order flow.
3. News article template + Knowledge Base article template.
4. Legal pages/content.
5. RU/AM/EN localization.
6. Final mobile/device/browser visual QA and SEO/meta pass.


## Article template update
- Added reusable `entra-article.html` for News and Knowledge Base.
- All 6 News cards now open article view.
- All 5 Popular Knowledge Base items now open article view.
- Added `article.css`, `article-data.js`, `article.js`.
