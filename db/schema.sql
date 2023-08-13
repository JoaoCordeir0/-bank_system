create database bank_system;

use bank_system;

create table users(
	user_id int auto_increment primary key,
    user_account_number varchar(25) not null,
    user_name varchar(255) not null,
    user_password varchar(255) not null,
    user_date_insert datetime not null
);

create table balance(
	fk_user_id int,
    user_balance float not null
);

create table log(
	log_id int auto_increment primary key,
    fk_user_id int not null,
	log_action varchar(50) not null,
    log_description text not null,
    log_date_insert datetime not null
);

alter table balance 
add constraint FK_balance_user
foreign key (fk_user_id) references users(user_id);

alter table log 
add constraint FK_log_user
foreign key (fk_user_id) references users(user_id);

                                                                /* 129055 */
insert into users values (1, '08344-6', 'João Victor Cordeiro', '$2y$10$mS3YdC/pumDNhZphUo9WsetOo9jXL/5rHWxsGu7ZCUfJgIoQNkrlu', now()); 
insert into balance values(1, 0);

