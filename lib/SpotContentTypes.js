
module.exports = exports = SpotContentTypes;

function SpotContentTypes() {
    this["application/json"] = {
        fromString: function(str) {
            return JSON.parse(str);    
        },
        toString: function(obj) {
            return JSON.stringify(obj);   
        }
    };
    this.default = {
        fromString: function(str) {
            return str;        
        },
        toString: function(obj) {
            return obj;    
        }
    };
    
    this.fromString = function(contentType, str) {
        if (this[contentType] && this[contentType].fromString) {
            return this[contentType].fromString(str);
        } else {
            return this.default.fromString(str);
        }  
    }
    
    this.toString = function(contentType, obj) {
        if (this[contentType] && this[contentType].toString) {
            return this[contentType].toString(obj);
        } else {
            return this.default.toString(obj);
        }
    }
        
}