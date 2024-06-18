import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnSignalAdminService {


    constructor(private http: HttpClient) {

    }

    sendMessage(title: any, message: any, playerId: any): Promise<any> {
        return this.http.post('https://onesignal.com/api/v1/notifications', {
            app_id:environment.oneSignal.appId,
            // "included_segments": ["All"],
            include_player_ids: [playerId],
            data: {foo: "var"},
            contents: {
                en: message
            },
            subtitle: {
                en: title
            }
        }, {
            headers: {
                authorization: `Basic ${environment.oneSignal.restApiKey}`
            }
        }).toPromise();
    }
}
