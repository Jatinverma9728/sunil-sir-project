// Native fetch is available in Node 18+

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let csrfToken = '';
let testProductId = '';

// Helper to log steps
const step = (msg) => console.log(`\n[STEP] ${msg}`);
const success = (msg) => console.log(`✅ ${msg}`);
const fail = (msg, err) => { console.error(`❌ ${msg}`, err); process.exit(1); };

async function runTest() {
    try {
        console.log("🚀 Starting Wishlist API Test...");
        const cookieJar = {
            cookies: [],
            getCookieString() { return this.cookies.join('; '); },
            setCookies(headers) {
                // Header keys can be lower case or upper case depending on implementation
                // Node fetch usually normalizes to lower-case 'set-cookie' if using Headers object, 
                // but raw objects might differ.
                let sCookie = headers.get ? headers.get('set-cookie') : headers['set-cookie'];
                if (!sCookie && headers.get) sCookie = headers.get('Set-Cookie');

                if (sCookie) {
                    console.log("   Extracted Set-Cookie header:", sCookie);
                    // Handle multiple cookies if comma separated (simple split)
                    const parts = sCookie.split(/,(?=\s*[^;]+=[^;]+)/);
                    parts.forEach(c => {
                        const cookieName = c.split(';')[0].trim();
                        this.cookies.push(cookieName);
                    });
                }
            }
        };

        // 0. Get CSRF Token
        step("Fetching CSRF Token...");
        const csrfRes = await fetch(`${API_URL}/csrf-token`);
        const csrfData = await csrfRes.json();
        csrfToken = csrfData.csrfToken;

        console.log("   CSRF Token received:", csrfToken);
        cookieJar.setCookies(csrfRes.headers);
        console.log("   Current Cookie Jar:", cookieJar.getCookieString());

        success(`CSRF Token: ${csrfToken}`);

        // 1. Login to get token
        step("Logging in...");
        const loginHeaders = {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
            'Cookie': cookieJar.getCookieString()
        };
        console.log("   Sending Login Headers:", JSON.stringify(loginHeaders, null, 2));

        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: loginHeaders,
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            })
        });

        console.log("   Login Status:", loginRes.status);
        cookieJar.setCookies(loginRes.headers);

        const text = await loginRes.text();
        let loginData;
        try {
            loginData = JSON.parse(text);
        } catch (e) {
            console.error("   Failed to parse login response:", text);
            throw new Error("Invalid JSON response from login");
        }

        if (!loginData.success) {
            console.error('   Login Error Response:', loginData);
            throw new Error(loginData.message || 'Login failed');
        }

        authToken = loginData.token;
        success("Logged in successfully");

        // 2. Get a product to add
        step("Fetching a product...");
        const productRes = await fetch(`${API_URL}/products`, {
            headers: { 'Cookie': cookieJar.getCookieString() }
        });
        const productData = await productRes.json();
        if (!productData.success || !productData.data || productData.data.length === 0) {
            throw new Error("No products found to test with");
        }
        testProductId = productData.data[0]._id;
        success(`Selected test product: ${testProductId}`);

        // 3. Add to Wishlist
        step("Adding product to wishlist...");
        const addHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'X-CSRF-Token': csrfToken,
            'Cookie': cookieJar.getCookieString()
        };
        const addRes = await fetch(`${API_URL}/wishlist/add`, {
            method: 'POST',
            headers: addHeaders,
            body: JSON.stringify({ productId: testProductId })
        });
        const addData = await addRes.json();
        if (!addData.success) {
            console.error('   Add Error Response:', addData);
            throw new Error(addData.message);
        }
        success("Added to wishlist");

        // 4. Fetch Wishlist and Verify
        step("Verifying wishlist content...");
        const getRes = await fetch(`${API_URL}/wishlist`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Cookie': cookieJar.getCookieString()
            }
        });
        const getData = await getRes.json();
        const exists = getData.data.products.some(p => p._id === testProductId || p === testProductId);
        if (!exists) throw new Error("Product not found in wishlist after adding");
        success("Product confirmed in wishlist");

        // 5. Remove from Wishlist
        step("Removing product from wishlist...");
        const removeRes = await fetch(`${API_URL}/wishlist/${testProductId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'X-CSRF-Token': csrfToken,
                'Cookie': cookieJar.getCookieString()
            }
        });
        const removeData = await removeRes.json();
        if (!removeData.success) throw new Error(removeData.message);
        success("Removed from wishlist");

        // 6. Verify Removal
        step("Confirming removal...");
        const finalGetRes = await fetch(`${API_URL}/wishlist`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Cookie': cookieJar.getCookieString()
            }
        });
        const finalData = await finalGetRes.json();
        if (finalData.data && finalData.data.products) {
            const stillExists = finalData.data.products.some(p => p._id === testProductId || p === testProductId);
            if (stillExists) throw new Error("Product still exists in wishlist after removal");
        }
        success("Product confirmed removed");

        console.log("\n✨ All Wishlist API tests passed!");

    } catch (error) {
        fail("Test Failed:", error);
    }
}

runTest();
