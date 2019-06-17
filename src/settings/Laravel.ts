export const Service: any = {

    /**
     * Url of your Laravel Project
     */

    url: 'http://192.168.43.21:3000',
    apiUrl: 'http://192.168.43.21:3000/api',

    // url: 'http://sgpsnotificaciones.herokuapp.com/',
    // apiUrl: 'http://sgpsnotificaciones.herokuapp.com/api',

    /**
     * Info of your passport client, usually second record on table "oauth_clients" in your database, name "Laravel Password Grant Client"
     */
    passport: {
        'grant_type': 'password',
        'client_id': '2',
        'client_secret': 'arf5Be8cEEBIUE5N6sD0xhNMXM7mLRWYuHZAu5yx',        // sgpsnotificaciones
        // 'client_secret': 'gwN0qY5xrrFt7oImjBVSRrYCsFimYAtLyFkbdNEQ',        // sgpsnotificaciones.herokuapp.com
    }

};