var fs = require('fs')
  , finder = require('findit')
  , Janus = require('cssjanus')
  , janus = Janus.CSSJanus()

finder('./public/css')
  .on('file', function (file) {
    // we use `&&` because regex does not have negative look behinds
    if (!file.match(/\.rtl\./) && file.match(/min\.css$/)) {
      var ltrCss = fs.readFileSync(file, 'utf8')
      var rtlCss = janus.transform(ltrCss)
      var rtlFileName = file.replace(/(\.min\.css)$/, '.rtl$1')
      fs.writeFileSync(rtlFileName, rtlCss, 'utf8')
    }
  })
