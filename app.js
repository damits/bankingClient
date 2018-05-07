var vue = new Vue({
  el: '#app',
  data:{
    status: 'signup',
    newAccount: {
      name: '',
      surname: '',
      email: '',
      password: '',
      iban: '',
      balance: '',
      transations: []
    },
    amount: 0,
    currentAccount: null,
    errorMessage: null,
    transations: [],
    accounts: []
  },
  methods:{
      signup: function() {
          this.errorMessage = null;
          this.$http.post('http://localhost:3001/signup', this.newAccount)
          .then(function(response){
            console.log("response:", response)
          })
          .catch(function(err){
            this.errorMessage = err.body.message;
            console.log(err);
          })
      },
      login: function() {
          this.errorMessage = null;
          this.$http.post('http://localhost:3001/login', {email: this.newAccount.email, password: this.newAccount.password})
          .then(function(response){
              localStorage.setItem('token', response.body.token);
              this.me();
          })
          .catch(function(err){
            this.errorMessage = err.body.message;
            console.log(err);
          })
      },
      logout: function() {
          this.currentAccount = null;
          localStorage.removeItem('token');
      },
      me: function() {
          this.$http.get(`http://localhost:3001/me?token=${localStorage.getItem('token')}`)
          .then((response)=>{
            console.log("response:", response);
            this.currentAccount = JSON.parse(response.body);
            for(var i=0;i<this.currentAccount.transations.length; i++) {
                console.log("this.currentAccount.transations:", this.currentAccount.transations);
                this.currentAccount.transations[i] = JSON.parse(this.currentAccount.transations[i])
            }
            //this.transations = JSON.parse(response.body.transations);
          })
      },

      sendMoney: function() {
        this.$http.post(`http://localhost:3001/banking/send?token=${localStorage.getItem('token')}`, {amount: this.amount})
        .then(function (response) {
          console.log("response:", response);
        })
      },

      getAllAccounts: function() {
          this.$http.get(`http://localhost:3001/accounts?token=${localStorage.getItem('token')}`)
          .then(function(response){
              this.accounts = response.body;
          })
      },

  },
  created(){
      if (localStorage.getItem('token')) {
        this.me();
        this.getAllAccounts();
      }
  }
})
