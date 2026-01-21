// CONFIGURATION (REPLACE WITH YOUR KEYS)
const SUPABASE_URL = 'https://kozmxgymkitcbevtufgz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sMp15iZ3aHBEz44x6YzISA_3fihZSgX';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.coins = 0;
let userId = null;

// INIT APP
async function initApp() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        userId = user.id;
        const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
        
        // CHECK IF BLOCKED
        if (profile.is_blocked) {
            alert("Your account is BLOCKED by admin!");
            await supabaseClient.auth.signOut();
            window.location.replace('login.html');
            return;
        }

        window.coins = Number(profile.coins || 0);
        refreshGlobalUI();
        setInterval(refreshGlobalUI, 1500); 
    } else {
        if (!window.location.pathname.includes('login.html')) window.location.replace('login.html');
    }
}

// REFRESH UI
function refreshGlobalUI() {
    const ids = ['home-coins', 'game-coins', 'ad-coins', 'p-coins', 'wallet-coins', 'gift-coins'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = window.coins;
    });
}

// LOGOUT
async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.replace('login.html');
}

initApp();
