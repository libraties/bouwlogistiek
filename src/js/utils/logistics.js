exports.calculate = function(size, days) {
  return {
    sand: Math.round(size * days / 32330),
    concrete: Math.round(size * days / 42000),
    a: Math.round(size * days / 20000),
    b: Math.round(size * days / 15000)
  };
};

exports.getSuppliers = function(calculation, suppliers) {
  var suppliersWithAmount = [];

  Object.keys(calculation).forEach(function(type) {
    var total = calculation[type];

    var suppliersForType = suppliers.features
        .filter(function(supplier) {
          return supplier.properties.type === type;
        });

    suppliersForType.forEach(function(supplier, i) {
      var amount = Math.round(total * Math.random());
      var supplierWithAmount = JSON.parse(JSON.stringify(supplier));

      if (i < suppliersForType.length - 1) {
        supplierWithAmount.properties._amount = amount;
        total -= amount;
      } else {
        supplierWithAmount.properties._amount = total;
      }

      suppliersWithAmount.push(supplierWithAmount);
    });
  });

  return {
    type: 'FeatureCollection',
    features: suppliersWithAmount
  };
};
