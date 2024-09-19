package org.example



import io.ktor.serialization.gson.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction


object Products : Table() {
    val id = integer("id").autoIncrement().autoIncrement()
    val name = varchar("name", 255)
    val description = text("description")
    val price = double("price")
    val imageUrl = varchar("image_url", 1024)
    val category = reference("category", Categories.id) // Связываем с таблицей Categories по колонке id
}