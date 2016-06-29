sc_require('engine');

Df.main = function main () {

  Df.engine = Df.Engine.create({});

  Df.engine.ignite();

  Df.getPath('mainPage.mainPane').append();

};


function main() { Df.main(); }
