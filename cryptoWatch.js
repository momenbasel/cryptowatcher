const https = require("https");
const readline = require("readline");
var player = require("play-sound")((opts = {}));
const figlet = require('figlet');

figlet('CRYPTO WATCHER ', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)

    rl.question("write the symbol of your coin ", ans => {
      var coin = null;
      coin = ans.toUpperCase().replace(/\s/g, "");
      if (coin !== null) {
        function requestPrice() {
          https.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`,
            res => {
              var data = "";
              res.on("data", chunk => {
                data += chunk;
              });

              res
                .on("end", () => {
                  var result = JSON.parse(data);
                  var old_price = result.USD;
                  console.log(`The ${coin} price now is ${old_price} USD`);
                  setInterval(() => {
                    https.get(
                      `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`,
                      res => {
                        var newdata = "";
                        res.on("data", chunk => {
                          newdata += chunk;
                        });
                        res.on("end", () => {
                          newResult = JSON.parse(newdata);
                          var new_price = newResult.USD;
                          if (old_price !== new_price) {
                            console.log(
                              `The price of ${coin} changed to ${new_price} USD`
                            );
                            old_price = new_price;
                            player.play("foo.mp3", function(err) {
                              if (err) throw err;
                            });
                          }
                        });
                      }
                    );
                  }, 10000);
                })
                .on("error", err => {
                  console.log("Error: " + err.message);
                });
            }
          );
        }

        requestPrice();
      }
    });

});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



var coin = null;
