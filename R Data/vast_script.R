library(ggplot2)
library(lubridate)
library(pwr)
library(dplyr)
library(magrittr)

rm(list = ls())

setwd("C:\\Users\\joket\\Desktop\\VAST\\Granted")

#read csv file into data frame
totalData <- read.csv(file="mc1-reports-data.csv", header=TRUE, sep=",")

n_locations = 19
n_types = 6

#Decide the colors to be associated with each variable measured
bar_colors <- c("Sewer and Water" = "blue",
                "Power" = "yellow",
                "Roads and Bridges" = "green",
                "Medical" = "red",
                "Buildings" = "violet",
                "Shake Intensity" = "light blue")

#filter out to have one day at a time
#------------------------------------------------------------------------------------------------------------
totalData$time <- ymd_hms(totalData$time)

oneDayData <- totalData %>%
  mutate(date_cutoff = as.POSIXct(date(min(time)) + days(1))) %>% 
  filter(time < date_cutoff)

twoDayData <- totalData %>%
  mutate(date_cutoff = as.POSIXct(date(min(time)) + days(2))) %>% 
  filter(time < date_cutoff)

threeDayData <- totalData %>%
  mutate(date_cutoff = as.POSIXct(date(min(time)) + days(3))) %>% 
  filter(time < date_cutoff)

#Choose data set to use
totalData <- threeDayData
#------------------------------------------------------------------------------------------------------------


#split data into data frames for each location
divData<-split(totalData, totalData$location, drop = TRUE)

#Make heat map csv
#------------------------------------------------------------------------------------------------------------
#Set which type to make csv for
filename = "roads2.csv"
column = 4

#create empty vectors to populate
score <- matrix(nrow = n_locations*11, ncol = 1)
location <- matrix(nrow = n_locations*11, ncol = 1)
total <- matrix(nrow = n_locations*11, ncol = 1)
k = 1
for(i in 1:n_locations){
  for(j in 1:11){
    location[k] <- i
    score[k] <- j - 1
    total[k] <- 0
    k = k + 1
  }
}
for(i in 1:nrow(totalData)) {
  if(is.na(totalData[i,column])==FALSE){
    index <- (totalData$location[i] - 1)*11 + totalData[i,column]
    total[index] <- total[index] + 1
  }
}
heatdata <- data.frame(location, score, total)
write.csv(heatdata, file = filename)

#------------------------------------------------------------------------------------------------------------


#Means
#------------------------------------------------------------------------------------------------------------
#create empty vectors and populate them with each variable and a location label and repeat for each location
means_data <- matrix(nrow = n_locations*n_types, ncol = 1)
locations <- matrix(nrow = n_locations*n_types, ncol = 1)
k = 1
for(i in 1:n_locations){
  for(j in 1:n_types){
    means_data[k] <- mean(divData[[i]][,j+1], na.rm = TRUE)
    locations[k] = i
    k = k + 1
  }
}
#convert to data frame
means_dataframe <- data.frame(locations, means_data)

type <- rep(c("Sewer and Water", "Power", "Roads and Bridges", "Medical", "Buildings", "Shake Intensity"),19)
#plot bar graph for all means
p <- ggplot(means_dataframe, aes(locations, means_data))
p + geom_bar(stat = "identity", aes(fill = type), position = "dodge") +
  xlab("Location") + ylab("Survey Score") +
  ggtitle("Mean Survey Results by Location") +
  scale_fill_manual("legend", values = bar_colors) +
  scale_y_continuous(limit = c(0, 10), breaks = seq(0, 10, 1)) +
  scale_x_continuous(breaks = seq(1, 19, 1)) +
  theme_classic()



#Single Type Means
#------------------------------------------------------------------------------------------------------------
#Change damage_type variable and graphs will come out accordingly
damage_type = "Building"
if (damage_type == "Sewer and Water") {
  j = 2
} else if (damage_type == "Power") {
  j = 3
} else if (damage_type == "Roads and Bridges") {
  j = 4
} else if (damage_type == "Medical") {
  j = 5
} else if (damage_type == "Building") {
  j = 6
} else {
  j = 7
}
fill_color = bar_colors[j-1]

#create empty vectors and populate them with each variable and a location label and repeat for each location
means_data <- matrix(nrow = n_locations, ncol = 1)
sd_data <- matrix(nrow = n_locations, ncol = 1)
locations <- seq(1, 19, 1)
for(i in 1:n_locations){
  means_data[i] <- mean(divData[[i]][,j], na.rm = TRUE)
  sd_data[i] <- sd(divData[[i]][,j], na.rm = TRUE)
}
#convert to data frame
means_dataframe <- data.frame(locations, means_data)

#set error bars max and min to between 0 and 10
error_min = means_data-sd_data
error_max = means_data+sd_data
for(i in 1:n_locations) {
  if (error_min[i] < 0) {
    error_min[i] <- 0
  }
  if (error_max[i] > 10) {
    error_max[i] <- 10
  }
}

#plot bar graph for single type means
p <- ggplot(means_dataframe, aes(reorder(locations, -means_data), means_data))
p + geom_bar(stat = "identity", fill = fill_color, show.legend = FALSE) +
  #geom_errorbar(aes(ymin=error_min, ymax=error_max), width=.2, position=position_dodge(.9)) +
  xlab("Location") + ylab("Survey Score") +
  ggtitle(paste("Mean Survey Results for", damage_type, "Damage", sep = " ", collapse = NULL)) +
  scale_y_continuous(limit = c(0, 10), breaks = seq(0, 10, 1)) +
  scale_x_discrete(breaks = seq(1, 19, 1)) +
  theme_classic()
#------------------------------------------------------------------------------------------------------------

#ANOVA and t-tests
#------------------------------------------------------------------------------------------------------------
#sewer and water
aov.sewer <- aov(sewer_and_water~location, data = totalData)
summary(aov.sewer)
pairwise.t.test(totalData$sewer_and_water, totalData$location, p.adj = "none")

#power
aov.power <- aov(power~location, data = totalData)
summary(aov.power)
pairwise.t.test(totalData$power, totalData$location, p.adj = "none")

#roads and bridges
aov.roads <- aov(roads_and_bridges~location, data = totalData)
summary(aov.roads)
pairwise.t.test(totalData$roads_and_bridges, totalData$location, p.adj = "none")

#medical
aov.medical <- aov(medical~location, data = totalData)
summary(aov.medical)
pairwise.t.test(totalData$medical, totalData$location, p.adj = "none")

#buildings
aov.buildings <- aov(buildings~location, data = totalData)
summary(aov.buildings)
pairwise.t.test(totalData$buildings, totalData$location, p.adj = "none")

#shake intensity
aov.shake <- aov(shake_intensity~location, data = totalData)
summary(aov.shake)
pairwise.t.test(totalData$shake_intensity, totalData$location, p.adj = "none")

#------------------------------------------------------------------------------------------------------------

#Variance
#------------------------------------------------------------------------------------------------------------
#create empty vectors and populate them with each variable and a location label and repeat for each location
var_data <- matrix(nrow = n_locations, ncol = 1)
locations <- seq(1, 19, 1)
var_count = 0
for(i in 1:n_locations){
  for(j in 1:n_types){
    current_var = var(divData[[i]][,j+1], na.rm = TRUE)
    if(is.na(current_var)==FALSE){
      var_count = var_count + current_var
    }
  }
  var_data[i] <- var_count / 6
  var_count = 0
}

#convert to data frame
var_dataframe <- data.frame(locations, var_data)

type <- rep(c("Sewer and Water", "Power", "Roads and Bridges", "Medical", "Buildings", "Shake Intensity"),19)

#plot bar graph for buildings means
p <- ggplot(var_dataframe, aes(reorder(locations, var_data), var_data))
p + geom_bar(stat = "identity", fill = "purple", show.legend = FALSE) +
  #geom_errorbar(aes(ymin=error_min, ymax=error_max), width=.2, position=position_dodge(.9)) +
  xlab("Location") + ylab("Mean Survey Score Variance") +
  ggtitle("Mean Variance of Survey Results") +
  scale_y_continuous(limit = c(0, 10), breaks = seq(0, 10, 1)) +
  scale_x_discrete(breaks = seq(1, 19, 1)) +
  theme_classic()
#------------------------------------------------------------------------------------------------------------

#Power Analysis
#------------------------------------------------------------------------------------------------------------
#abandoned all power graph
#------------------------------------------------------------------------------------------------------------
#create empty vectors and populate them with each variable and a location label and repeat for each location
pwr_data <- matrix(nrow = n_locations*n_types, ncol = 1)
locations <- matrix(nrow = n_locations*n_types, ncol = 1)
k = 1
sample_size = 0
for(i in 1:n_locations){
  for(j in 1:n_types){
    sample_size <- sum(is.na(divData[[i]][j+1])==FALSE)
    pwr_results <- pwr.t.test(n = sample_size, d = .1, sig.level = 0.05, type = "paired")
    pwr_data[k] <- pwr_results$power
    locations[k] = i
    k = k + 1
  }
}

#convert to data frame
pwr_dataframe <- data.frame(locations, pwr_data)

type <- rep(c("Sewer and Water", "Power", "Roads and Bridges", "Medical", "Buildings", "Shake Intensity"),19)
#plot bar graph for all means
p <- ggplot(pwr_dataframe, aes(locations, pwr_data))
p + geom_bar(stat = "identity", aes(fill = type), position = "dodge") +
  xlab("Location") + ylab("Survey Score") +
  ggtitle("Power of Survey Results by Location") +
  scale_fill_manual("legend", values = bar_colors) +
  scale_y_continuous(limit = c(0, 1), breaks = seq(0, 1, .1)) +
  scale_x_continuous(breaks = seq(1, 19, 1)) +
  theme_classic()
#------------------------------------------------------------------------------------------------------------
#Mean Power

#create empty vectors and populate them with each variable and a location label and repeat for each location
pwr_data <- matrix(nrow = n_locations, ncol = 1)
locations <- seq(1, 19, 1)
pwr_count = 0
for(i in 1:n_locations){
  for(j in 1:n_types){
    sample_size <- sum(is.na(divData[[i]][j+1])==FALSE)
    pwr_results <- pwr.t.test(n = sample_size, d = .1, sig.level = 0.05, type = "paired")
    current_pwr <- pwr_results$power
    if(is.na(current_pwr)==FALSE){
      pwr_count = pwr_count + current_pwr
    }
  }
  pwr_count = pwr_count / 6
  if (pwr_count > 1) {
    pwr_data[i] <- 1
  } else {
    pwr_data[i] <- pwr_count
  }
  pwr_count = 0
}

#convert to data frame
pwr_dataframe <- data.frame(locations, pwr_data)

type <- rep(c("Sewer and Water", "Power", "Roads and Bridges", "Medical", "Buildings", "Shake Intensity"),19)

#plot bar graph for buildings means
p <- ggplot(pwr_dataframe, aes(reorder(locations, -pwr_data), pwr_data))
p + geom_bar(stat = "identity", fill = "orange", show.legend = FALSE) +
  #geom_errorbar(aes(ymin=error_min, ymax=error_max), width=.2, position=position_dodge(.9)) +
  xlab("Location") + ylab("Mean Power of Survey Results") +
  ggtitle("Mean Power by Location") +
  scale_y_continuous(limit = c(0, 1), breaks = seq(0, 1, .1)) +
  scale_x_discrete(breaks = seq(1, 19, 1)) +
  theme_classic()

#------------------------------------------------------------------------------------------------------------
