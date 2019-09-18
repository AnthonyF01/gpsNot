export const Service: any = {

    /**
     * Url of your Laravel Project
     */

    // url: 'http://192.168.43.21:3000',
    // apiUrl: 'http://192.168.43.21:3000/api',

    // url: 'http://sgpsnotificaciones.herokuapp.com/',
    // apiUrl: 'http://sgpsnotificaciones.herokuapp.com/api',

    url: 'http://escuelajudicialcortedeventanilla.com/notificaciones',
    apiUrl: 'http://escuelajudicialcortedeventanilla.com/notificaciones/api',

    /**
     * Info of your passport client, usually second record on table "oauth_clients" in your database, name "Laravel Password Grant Client"
     */
    passport: {
        'grant_type': 'password',
        'client_id': '2',
        // 'client_secret': 'IRlVSAEy408n2hBLg6iop17W68bVB7yFr49j5HQU',        // notificaciones
        // 'client_secret': '62aYxoaXUI9pDrVxq7I9s9gxRaqnQ2hhQ3Bgcr5I',        // sgpsnotificaciones.herokuapp.com
        'client_secret': 'IRlVSAEy408n2hBLg6iop17W68bVB7yFr49j5HQU',        // escuelajudicialcortedeventanilla.com/notificaciones
    }

};
