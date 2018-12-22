let formBook = Vue.component('formBook', {
    template: `
    <v-container>
        <v-progress-circular v-if="loading"
        :size="70"
        :width="7"
        color="blue"
        indeterminate
        ></v-progress-circular>
        <v-layout row wrap justify-space-between v-if="!loading">
            <v-flex xs12 sm4>
                <img :src="book.img ? book.img : 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png'">
            </v-flex>

            <v-flex xs12 sm6 class="data">
                <v-form v-model="valid" style="width: 100%">
                    <v-text-field
                    v-model="book.title"
                    :rules="[v => !!v || 'Title is required']"
                    label="Title"
                    required
                    ></v-text-field>

                    <v-text-field
                    v-model="book.subtitle"
                    :rules="[v => !!v || 'Subtitle is required']"
                    label="SubTitle"
                    required
                    ></v-text-field>

                    <v-text-field
                    v-model="book.author"
                    :rules="[v => !!v || 'Author is required']"
                    label="Author"
                    required
                    ></v-text-field>

                    <v-text-field
                    v-model="book.img"
                    :rules="[v => !!v || 'Image URL is required']"
                    label="Image Url"
                    required
                    ></v-text-field>
                    <v-layout v-if="!loading" row wrap>
                        <v-btn :disabled="!valid" color="success" @click="saveBook()">Save<v-icon>save</v-icon></v-btn>
                        <v-btn color="error" @click="cancel()">Cancel<v-icon>cancel</v-icon></v-btn>
                    </v-layout>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
    `,
    data(){
        return {
            loading: false,
            book: {
                title: '',
                subtitle: '',
                author: '',
                img: ''
            },
            valid: false,
            id: ''
        }
    },
    methods: {
        saveBook(){
            this.loading = true;
            if(this.$route.params['id']){
                axios.put(`https://book-store-12001.firebaseio.com/${this.id}/.json`, this.book).then((res, err)=>{
                    this.$router.push('/view/'+this.id);
                    if(err) console.log(err)
                })
            }
            else{
                axios.post(`https://book-store-12001.firebaseio.com/.json`, this.book).then((res, err)=>{
                    this.$router.push('/view/'+res.data.name);
                    // console.log(res);
                    if(err) console.log(err)
                })  
            }
        },
        cancel(){
            if(this.$route.params['id']){
                this.$router.push('/view/'+this.id)
            }
            else{
                this.$router.push('/') 
            }
        }
    },
    mounted(){
        if(this.$route.params['id']){
            this.loading = true;
            this.id = this.$route.params['id'];
            axios.get(`https://book-store-12001.firebaseio.com/${this.id}/.json`).then((data,err)=>{
                this.book = data.data;
                this.loading = false;
                if(err) console.log(err)
            })
        }

    }
})

let book = Vue.component('book', {
    template: `
    <v-container>
        <v-progress-circular v-if="loading"
        :size="70"
        :width="7"
        color="blue"
        indeterminate
        ></v-progress-circular>
        <v-layout row wrap justify-space-between v-if="!loading">
            <v-flex xs12 sm4>
                <img :src="book.img">
            </v-flex>
            <v-flex xs12 sm6 class="data">
                <h1>Title: {{book.title}}</h1>
                <h4>Subtitle: {{book.subtitle}}</h4>
                <p>Author: {{book.author}}</p>
            </v-flex>
        </v-layout>
        <v-layout v-if="!loading" row wrap>
            <v-btn color="success" @click="editBook()">Edit<v-icon>edit</v-icon></v-btn>
            <v-btn color="error" @click="deleteBook()">Delete<v-icon>delete</v-icon></v-btn>
        </v-layout>
    </v-container>
    `,
    data(){
        return {
            id: '',
            book: {},
            loading: true
        }
    },
    mounted(){
        this.id = this.$route.params['id'];
        axios.get(`https://book-store-12001.firebaseio.com/${this.id}/.json`).then((data, err)=>{
            this.book = data.data;
            this.loading = false;
            if(err) console.log(err);
        })
    },
    methods: {
        deleteBook(){
            this.loading = true;
            axios.delete(`https://book-store-12001.firebaseio.com/${this.id}/.json`).then((res, err)=>{
                this.$router.replace('/');
                if(err) console.log(err);
            })
        },
        editBook(){
            this.$router.push('/edit/'+this.id);
        }
    },
})
let all = Vue.component('all', {
    template: `
        <div style="width: 100%">
                <v-layout row wrap justify-center>
                    <v-flex xs12>
                        <v-card dark color="primary" style="margin-bottom: 1rem">
                            <v-card-text class="px-0">Add a book <v-btn flat small @click="$router.push('/create')">Now !<v-icon>add</v-icon></v-btn></v-card-text>
                        </v-card>
                    </v-flex>    
                </v-layout>
				
				<v-container fluid>
				<v-progress-circular v-if="loading"
				:size="70"
				:width="7"
				color="blue"
				indeterminate
				></v-progress-circular>
                <v-layout row wrap align-center v-if="!loading">
                    <v-card :key="i" v-for="(book, i) in books" style="margin: 0.5rem">
                        <v-img
                        :src="book.img"
                        aspect-ratio="2.75"
                        ></v-img>

                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">{{book.title}}</h3>
                                <h5>{{book.subtitle}}</h5>
                                <p>{{book.author}}</p>
                            </div>
                        </v-card-title>

                        <v-card-actions>
                            <v-btn flat color="orange" @click="$router.push('/view/'+i)">View</v-btn>
                            <v-btn flat color="orange" @click="$router.push('/edit/'+i)">
                                Edit
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-layout>
            </v-container>
        </div>
    `,
    data() {
        return {
            loading: true,
        }
    },
    mounted() {
        axios.get("https://book-store-12001.firebaseio.com/.json").then((data, err)=>{
            this.loading = false;
            this.books = data.data;
            if(err) console.log(err);
        })
    },
})

const routes = [
    { path: '/', component: all },
    { path: '/view/:id', component: book },
    { path: '/create', component: formBook },
    { path: '/edit/:id', component: formBook }
]

const router = new VueRouter({
  routes
})

let app = new Vue({
    el: '#app',
    router,
    components: {
        all,
        book,
        formBook
    }
})
