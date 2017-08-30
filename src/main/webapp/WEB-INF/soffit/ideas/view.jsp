<script>
  var bearer = '${bearer}'
  console.log(bearer)
  console.log("-----------------")
  var token = '${bearer.getEncryptedToken()}'
  console.log(token)
</script>
<div id="idea-root">
  <h2>Aww yeahhhh</h2>
</div>
<script src="${pageContext.request.contextPath}/js/main.js" type="text/javascript"></script>
