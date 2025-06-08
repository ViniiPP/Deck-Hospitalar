package br.login.api.apilogin.components;

import br.login.api.apilogin.configs.RabbitMQconfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;


@Component
public class SensorMessageListener {
    private static final Logger logger = LoggerFactory.getLogger(SensorMessageListener.class);
    @RabbitListener(queues = RabbitMQconfig.QUEUE_NAME)
    public void receiveMessage(String message) {
        logger.info(message);
    }
}
