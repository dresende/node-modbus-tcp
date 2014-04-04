var assert = require("assert");

exports.addStreamTest = function (stream, description, data, result) {
	describe(description, function () {
		it("should pass", function (done) {
			var s = new stream();

			s.on("data", function (data) {
				assert.deepEqual(data, result);

				return done();
			});


			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					s.write(data[i]);
				}
			} else {
				s.write(data);
			}
		});
	});
};
