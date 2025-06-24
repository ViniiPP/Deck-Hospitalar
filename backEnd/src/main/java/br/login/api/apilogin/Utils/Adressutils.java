package br.login.api.apilogin.Utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component

public class Adressutils {




    @Value("${link.server.adress}")
    private String url;


    public  String urlGet () {
        return url;
    }


}
