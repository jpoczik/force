/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Markdown } = require('@artsy/backbone-mixins');

export const markdown = string => Markdown.mdToHtml.apply({ get() { return string; } }, [null, {sanitize: false}]);
