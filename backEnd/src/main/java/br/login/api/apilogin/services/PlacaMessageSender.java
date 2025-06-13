package br.login.api.apilogin.services;

import br.login.api.apilogin.entitys.DadosEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public final class PlacaMessageSender {

    private final SimpMessagingTemplate template;

    public PlacaMessageSender(SimpMessagingTemplate template) {
        this.template = template;
    }


    public void enviarMensagem(DadosEntity dados){{
        template.convertAndSend("/topic/placa/"+dados.getUuid(), dados);
    }
    }
}
