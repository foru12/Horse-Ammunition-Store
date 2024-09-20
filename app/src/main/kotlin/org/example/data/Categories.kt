package org.example.data
import org.jetbrains.exposed.sql.*

object Categories : Table() {
    val id = integer("id").autoIncrement().autoIncrement()
    val name = varchar("name", 255)
    override val primaryKey = PrimaryKey(id)
}
