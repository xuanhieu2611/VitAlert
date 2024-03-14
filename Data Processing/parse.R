library(readr)
library(dplyr)
library(RJSONIO)

rdi = read_tsv("./rdi.tsv")
rdi$PregnantWomen
json <- toJSON(rdi)
write.table(json, file = "rdi.json", row.names = F, quote=F, col.names = F)


symptoms <- read_tsv("./symptoms.tsv", comment = "@")
symptoms$Nutrient
symptoms$Function
symptoms$Symptoms

symptoms2 <- read_tsv("./symptoms2.tsv", comment = "@")
symptoms2$Name
symptoms2$Rarity
symptoms2$Function
symptoms2$Sources
symptoms2$Symptoms
symptoms2Json <- toJSON(symptoms2)
write.table(symptoms2Json, file = "symptoms2.json", row.names = F, quote = F, col.names = F)
