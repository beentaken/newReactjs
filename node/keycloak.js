const KcAdminClient = require('@keycloak/keycloak-admin-client').default;

async function setupKeycloak() {
    const kcAdminClient = new KcAdminClient({
        baseUrl: 'http://localhost:8080',
        realmName: 'master',
    });

    // 1️⃣ Login as master admin
    await kcAdminClient.auth({
        grantType: 'password',
        clientId: 'admin-cli',
        username: 'admin',
        password: 'admin',
    });

    // 2️⃣ Create Realm
    const realmName = 'demo';
    try {
        await kcAdminClient.realms.create({
            realm: realmName,
            enabled: true,
            displayName: 'Demo Realm',
        });
        console.log(`Realm '${realmName}' created`);
    } catch (err) {
        if (err.response && err.response.status === 409) {
            console.log(`⚠️ Realm '${realmName}' already exists`);
        } else throw err;
    }

    // Switch context to the new realm
    kcAdminClient.setConfig({ realmName });

    // 3️⃣ Create Client
    const clientId = 'testc';
    let client;
    try {
        client = await kcAdminClient.clients.create({
            clientId,
            directAccessGrantsEnabled: true, // enable password grant
            serviceAccountsEnabled: true,
            secret: 'ssssss',
            publicClient: false,
            protocol: 'openid-connect',
        });
        console.log(`Client '${clientId}' created`);
    } catch (err) {
        console.log(`Client '${clientId}' may already exist`);
    }

    // Get full client info (including internal ID)
    const foundClients = await kcAdminClient.clients.find({ clientId });
    const clientUuid = foundClients[0].id;

    // 4️⃣ Create User
    const username = 'admin';
    let user;
    try {
        user = await kcAdminClient.users.create({
            username,
            enabled: true,
            emailVerified: true,
        });
        console.log(`User '${username}' created`);
    } catch (err) {
        console.log(`User '${username}' may already exist`);
    }

    // Get the user again (to get ID)
    const foundUsers = await kcAdminClient.users.find({ username });
    const userId = foundUsers[0].id;

    // Set user password
    await kcAdminClient.users.resetPassword({
        id: userId,
        credential: {
            temporary: false,
            type: 'password',
            value: 'P@ssw0rd',
        },
    });

    // 5️⃣ Create Role
    const roleName = 'myrole';
    try {
        await kcAdminClient.roles.create({
            name: roleName,
            description: 'Custom role for demo user',
        });
        console.log(`Role '${roleName}' created`);
    } catch (err) {
        console.log(`Role '${roleName}' may already exist`);
    }

    // 6️⃣ Assign Role to User
    const role = await kcAdminClient.roles.findOneByName({ name: roleName });
    await kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        roles: [{ id: role.id, name: role.name }],
    });
    console.log(`Role '${roleName}' assigned to user '${username}'`);

    console.log('Setup complete!');
}

setupKeycloak().catch(console.error);
