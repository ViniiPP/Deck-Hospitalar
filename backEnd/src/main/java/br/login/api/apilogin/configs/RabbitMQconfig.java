package br.login.api.apilogin.configs;


import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQconfig {

    public static final String QUEUE_NAME = "raspbarry-sensores";

    @Bean
    public Queue queue() {
        return new Queue(QUEUE_NAME,true);
    }
}
