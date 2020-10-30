<script>
    import { Router, Route, navigate } from 'svelte-routing';
    import Login from './Login.svelte';
    import Register from './Register.svelte';

    let url = '';

    $: if (!['login', /register/].find(u => url.match(u)))
        navigate('/login');
</script>

<Router {url}>
    <Route path="login" component={Login}/>
    <Route path="register" component={Register}/>
    <Route path="register/:step" component={Register}/>
</Router>
