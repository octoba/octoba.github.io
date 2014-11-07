Foo = {};
Foo.images = [];
Foo.stopLoadingImages = function() {
  $$("#foo img").each(function(image) {
    image.orgSrc = image.src;
    image.src = "1x1.gif";
    Foo.images.push(image);
  });
};
Foo.loadImages = function() {
  Foo.images.each(function(image) {
    image.src = image.orgSrc;
  });
};
