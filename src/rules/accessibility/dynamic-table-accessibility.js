HTMLHint.addRule({
    id: 'dynamic-table-acceessibility',
    description: 'verify dynamic table has accessibilityTable binding and its title has accessibilityRowTitle binding.',
    init: function(parser, reporter){

        var inTable = false;
        var inTableTitle = false;
        var unclosedDivsCounter = 0;
        var unclosedTablesCounter = 0;
        var isExistAccessibilityTitleElement = [];       

        var self = this;   

        var elementWithoutHeadingRole = function(event){
            var roleAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"role");
            return roleAttribute !== 'heading';
         };

        var elementWithoutAriaLevel = function(event){
            var ariaLevelValue = HTMLHint.utils.getAttributeValue(event.attrs,"aria-level");        
            return ariaLevelValue === '';
        };

        var isTableTitle = function(event){
            return HTMLHint.utils.isClassExsits(event.attrs, "table-title-operation");
        };

        var isAccessibilityTitleElement = function(event){
            return inTable && inTableTitle && HTMLHint.utils.isClassExsits(event.attrs, "accessibility-table-title");
        };        

        var isTbobyWithoutAccessibilityTableBind = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return !bindAttributeValue.includes('accessibilityTable');
        };

        var elementWithoutAccessibilityRowTitleBind = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return !bindAttributeValue.includes('accessibilityRowTitle');
        };
               
        var elementWithouttableNameBind = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return !bindAttributeValue.includes('tableName');
        };

        var isRemoveRowElement = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttributeValue.includes('removeRow');
        };

        var isAddRowButton = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttributeValue.includes('addRow');
        };

        var isRolePresentation = function(event){
            var roleAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'role');
            return roleAttributeValue === 'presentation';
        };

        var isAriaLabelAttr = function(event) {            
            return HTMLHint.utils.isAttributeExists(event.attrs, 'aria-label');                                             
        };    

        var isAriaLabelledbyAttr = function(event) {            
            return HTMLHint.utils.isAttributeExists(event.attrs, 'aria-labelledby');                                             
        }; 

        var isDataToFocusAttr = function(event) {            
            return HTMLHint.utils.isAttributeExists(event.attrs, 'data-tofocus');                                             
        };          

        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if (tagName === 'tbody' && inTable && isTbobyWithoutAccessibilityTableBind(event)){
                reporter.error('dynamic table tbody should have accessibilityTable binding. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }           
            if (isAccessibilityTitleElement(event)){
                isExistAccessibilityTitleElement[unclosedTablesCounter - 1] = true;
                if(elementWithoutHeadingRole(event)){
                    reporter.error('accessibility title element should have role attribute with heading value. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
                }
                if(elementWithoutAriaLevel(event)){
                    reporter.error('accessibility title element should have aria-level attribute. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
                }
                if(elementWithoutAccessibilityRowTitleBind(event)){
                    reporter.error('accessibility title element should have accessibilityRowTitle binding. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }
                if(elementWithouttableNameBind(event)){
                    reporter.error('accessibility title element should have "tableName" binding with value of tabel name in hebrew. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }
            }
            
           
            if(tagName === 'input' && isAddRowButton(event)){
                if(!isAriaLabelAttr(event)){
                    reporter.error('Add row button should contain "aria-label" attribute that describe which tabel to add row. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }
            }                       
            if(isRemoveRowElement(event)){
                if(!isAriaLabelledbyAttr(event) && !isAriaLabelAttr(event)){
                    reporter.error('Remove row element should contain "aria-labelledby" attribute that bind to span that describe delete row. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }                
                if(tagName === 'input' && !isDataToFocusAttr(event)){
                    reporter.error('Remove row element should contain "data-tofocus" attribute. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }
            }             
            if (HTMLHint.utils.isDynamicTable(tagName,event.attrs)  && !event.close){
                if(!isRolePresentation(event)){
                    reporter.error('add role=presentation to table tag. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }  
               unclosedTablesCounter++;
               inTable = true;
            }    
            if (inTable && isTableTitle(event)  && !event.close)  {
                inTableTitle = true;
            } 
            if (inTableTitle) {
                unclosedDivsCounter++;
            }            
        });
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();          
            if (tagName === "table" && unclosedTablesCounter>0) {
                unclosedTablesCounter--;
                if(!isExistAccessibilityTitleElement[unclosedTablesCounter]){
                    reporter.error('dynamic table title should have div with "accessibility-table-title" class (under "table-title-operation" div). Error on line ' + event.line , event.line, event.col, self, event.raw);
                }                            
            }
            if (tagName === "div" && unclosedDivsCounter>0) {
                unclosedDivsCounter--;
            }
            if (unclosedTablesCounter === 0)  {
                inTable = false;
            }
            if(unclosedDivsCounter === 0)    {
                inTableTitle = false;
            }  
        });        
    }
});
