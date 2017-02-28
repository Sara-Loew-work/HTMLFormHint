HTMLHint.addRule({
    id: 'containers-accessibility',
    description: 'div with class container should have role of tabPanel and attr binding of id and aria-labeledby',
    init: function (parser, reporter) {
        var self = this;
        var isContainer = function (element, attributes) {
            return (element === "div" && HTMLHint.utils.hasClass(attributes, "container"));
        };

        var trimAll = function (val) {
            if (typeof val !== 'string') {
                return;
            }
            return val().replace(/ /g, '');
        }

        var isContainerWithoutAttrBinding = function (bindings) {
            return !bindings.includes('attr');
        };

        var isContainerWithoutAriaLabeledbyBinding = function (bindings, requestedBind) {
            var ariaLabelBinding = trimAll(HTMLHint.resources.containersAccessibility.ariaLabelBinding);
            return isContainerWithoutAttrBinding() || !bindings.includes(ariaLabelBinding);
        };

        var isContainerWithoutIdBinding = function (bindings, requestedBind) {
           var idBinding = trimAll(HTMLHint.resources.containersAccessibility.idBinding);
            return isContainerWithoutAttrBinding() || !bindings.includes(idBinding);
        }
        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName.toLowerCase();

            if (isContainer(tagName, event.attrs)) {
                var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, "role");
                var dataBindings = HTMLHint.utils.getAttributeValue(event.attrs, "data-bind");
                if (roleAttr !== 'tabpanel') {
                    reporter.error('div with class container should have role "tabpanel"', event.line, event.col, self, event.raw);
                }

                if (bindingContains(dataBindings, 'tabpanel_')) {
                    reporter.error('div with class container should have attr binding of id that starts with "tabpanel_"', event.line, event.col, self, event.raw);
                }

                if (bindingContains(dataBindings, 'tab_')) {
                    reporter.error('div with class container should have attr binding of aria-labeledby to an id that starts with "tab_"', event.line, event.col, self, event.raw);
                }
            }
        });

    }
});
