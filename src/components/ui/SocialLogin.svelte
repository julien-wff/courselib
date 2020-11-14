<script>
    import SocialImg from './SocialImg.svelte';
    import GoogleLogin from '../../images/social/google-login.png';
    import FacebookLogin from '../../images/social/facebook-login.png';
    // import AppleLogin from '../../images/social/apple-login.png';
</script>


<div class="w-full flex justify-center my-4">
    <SocialImg src={GoogleLogin} alt="Google" provider="google" on:social-click/>
    <SocialImg src={FacebookLogin} alt="Facebook" provider="facebook" on:social-click/>
<!--    <SocialImg src={AppleLogin} alt="Apple" provider="Apple" on:social-click/>-->
</div>
