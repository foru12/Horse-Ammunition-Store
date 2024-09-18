package org.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.productRoutes() {
    route("/products") {
        get {
            // Больше тестовых товаров
            val products = listOf(
                Product(1, "Седло комфорт", "Удобное седло для верховой езды", 1500.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Седла"),
                Product(2, "Седло премиум", "Премиум седло для долгих прогулок", 2500.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Седла"),
                Product(3, "Седло спортивное", "Спортивное седло для соревнований", 3000.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Седла"),
                Product(4, "Вольтрап классический", "Вольтрап для седла", 800.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Вольтрапы"),
                Product(5, "Вольтрап комфорт", "Мягкий вольтрап для удобства", 950.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Вольтрапы"),
                Product(6, "Вольтрап спортивный", "Спортивный вольтрап", 1200.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Вольтрапы"),
                Product(7, "Подпруга мягкая", "Мягкая и удобная подпруга", 1200.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Подпруги"),
                Product(8, "Подпруга прочная", "Прочная подпруга для соревнований", 1350.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Подпруги"),
                Product(9, "Элемент упряжи", "Качественные элементы упряжи", 600.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Элементы упряжи"),
                Product(10, "Комплект упряжи", "Полный комплект упряжи", 1800.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Элементы упряжи"),
                Product(11, "Седло комфорт", "Удобное седло для верховой езды", 1500.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Седла"),
                Product(12, "Седло премиум", "Премиум седло для долгих прогулок", 2500.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Седла"),
                Product(13, "Седло спортивное", "Спортивное седло для соревнований", 3000.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Седла"),
                Product(14, "Вольтрап классический", "Вольтрап для седла", 800.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Вольтрапы"),
                Product(15, "Вольтрап комфорт", "Мягкий вольтрап для удобства", 950.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Вольтрапы"),
                Product(16, "Вольтрап спортивный", "Спортивный вольтрап", 1200.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Вольтрапы"),
                Product(17, "Подпруга мягкая", "Мягкая и удобная подпруга", 1200.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Подпруги"),
                Product(18, "Подпруга прочная", "Прочная подпруга для соревнований", 1350.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Подпруги"),
                Product(19, "Элемент упряжи", "Качественные элементы упряжи", 600.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Элементы упряжи"),
                Product(20, "Комплект упряжи", "Полный комплект упряжи", 1800.0, "https://avatars.mds.yandex.net/i?id=1ba7b5ffce86bba1a468c3709da53d6c_l-10471467-images-thumbs&ref=rim&n=13&w=800&h=800", "Элементы упряжи")

            )
            call.respond(products)
        }
    }
}

