package br.login.api.apilogin.components;

import br.login.api.apilogin.Utils.ManiputaltionData;
import br.login.api.apilogin.configs.RabbitMQconfig;
import br.login.api.apilogin.entitys.DadosEntity;
import br.login.api.apilogin.services.PlacaMessageSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;


@Component
public class SensorMessageListener {
    private static final Logger logger = LoggerFactory.getLogger(SensorMessageListener.class);

    private final PlacaMessageSender placaMessageSender;

    public SensorMessageListener(PlacaMessageSender placaMessageSender) {
        this.placaMessageSender = placaMessageSender;
    }

    @RabbitListener(queues = RabbitMQconfig.QUEUE_NAME)
    public void receiveMessage(String message) throws Exception {
        DadosEntity dados = ManiputaltionData.ConvertionData(message);
        System.out.println(dados.toString());
        placaMessageSender.enviarMensagem(dados);
        logger.info(message);
    }
}
