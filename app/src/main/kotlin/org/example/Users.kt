package org.example
import io.ktor.serialization.gson.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
object Users : Table("users") {
    val id = integer("id").autoIncrement().autoIncrement()
    val username = varchar("username", 255).uniqueIndex()
    val email = varchar("email", 255).uniqueIndex()
    val password = varchar("password", 255)  // Здесь будем хранить хешированный пароль
}
