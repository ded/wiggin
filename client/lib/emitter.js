provide('client/lib/emitter', function () {
  return require('klass')(function () {
    this.$emitter = $({})
  })
  .methods({
    on: function () {
      this.$emitter.on.apply(this.$emitter, arguments)
      return this
    }
  , off: function () {
      this.$emitter.off.apply(this.$emitter, arguments)
      return this
    }
  , emit: function () {
      this.$emitter.emit.apply(this.$emitter, arguments)
      return this
    }
  })
}())
