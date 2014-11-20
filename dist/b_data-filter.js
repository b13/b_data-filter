define([
	"underscore"
], function(_){

	var DF = {}

	DF.Filter = function(opts){
		var f = this;
		return f.initialize(opts);
	}
	DF.Filter.prototype = {

		initialize: function(opts){
			var f = this;

			f.subFilters = [];

			if(opts){
				if(_.isArray(opts.subFilters)){
					_.each(opts.subFilters, function(subFilterOpts){
						f.subFilters.push(new DF.SubFilter(subFilterOpts));
					});
				}
			}
			return f;
		},

		filter: function(filterAttributes, dataArray){
			var f = this,
				resultArray;

			if(_.isArray(dataArray)){
				resultArray = dataArray.slice();
			} else {
				throw "The provided dataArray must be of type array.";
			}

			_.each(f.subFilters, function(subFilter){
				resultArray = subFilter.filter(filterAttributes, resultArray);
			});

			return resultArray;
		}
	}

	DF.SubFilter = function(subFilterOpts){
		var sf = this;
		sf.initialize(subFilterOpts);
	}
	DF.SubFilter.prototype = {

		preparedFilterFunctions: {
			"equal"              : function(referenceVal, dataVal){ return (referenceVal == dataVal); },
			"equalStrict"        : function(referenceVal, dataVal){ return (referenceVal === dataVal); },
			"greaterThan"        : function(referenceVal, dataVal){
				var val1, val2;
				val1 = (_.isString(referenceVal)) ? parseFloat(referenceVal) : referenceVal;
				val2 = (_.isString(referenceVal)) ? parseFloat(dataVal) : dataVal;
				return (val1 > val2);
			},
			"greaterThanOrEqual" : function(referenceVal, dataVal){
				var val1, val2;
				val1 = (_.isString(referenceVal)) ? parseFloat(referenceVal) : referenceVal;
				val2 = (_.isString(referenceVal)) ? parseFloat(dataVal) : dataVal;
				return (val1 >= val2);
			},
			"lessThan"           : function(referenceVal, dataVal){
				var val1, val2;
				val1 = (_.isString(referenceVal)) ? parseFloat(referenceVal) : referenceVal;
				val2 = (_.isString(referenceVal)) ? parseFloat(dataVal) : dataVal;
				return (val1 < val2);
			},
			"lessThanOrEqual"    : function(referenceVal, dataVal){
				var val1, val2;
				val1 = (_.isString(referenceVal)) ? parseFloat(referenceVal) : referenceVal;
				val2 = (_.isString(referenceVal)) ? parseFloat(dataVal) : dataVal;
				return (val1 <= val2);
			}
		},

		initialize: function(subFilterOpts){
			var sf = this;

			sf.origConf = subFilterOpts;
			sf.referenceAttributeName = subFilterOpts.referenceAttribute;
			sf.dataAttributeName = subFilterOpts.dataAttribute || sf.referenceAttributeName;
			sf.skipEmptyReferenceAttribute = (subFilterOpts.skipEmptyReferenceAttribute || (typeof subFilterOpts.skipEmptyReferenceAttribute === 'undefined')) ? true : false;

			if(_.isFunction(subFilterOpts.filterFunction)){
				sf.filterFunction = subFilterOpts.filterFunction;
			}
			else if(_.isString(subFilterOpts.filterFunction)){
				sf.filterFunction = sf.preparedFilterFunctions[subFilterOpts.filterFunction];
			}
		},

		filter: function(referenceAttributes, dataArray){

			var sf = this,
				resultArray = [],
				referenceVal = referenceAttributes[sf.referenceAttributeName];

			if(sf.skipEmptyReferenceAttribute
				&& (typeof referenceVal === 'undefined' || referenceVal === null || referenceVal === "")){
				/**
				 * 	Return a shallow copy of the data array if the reference value is empty and the
				 * 	skipEmptyReferenceAttribute is set.
				 */
				return dataArray.slice();
			}
			_.each(dataArray, function(dataEntity){
				var dataVal = dataEntity[sf.dataAttributeName];
				if(sf.filterFunction(referenceVal, dataVal)) resultArray.push(dataEntity);
			});

			return resultArray;
		}

	}

	return DF;
});