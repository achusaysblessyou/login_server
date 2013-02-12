class User < ActiveRecord::Base
  attr_accessible :count, :password, :user

  validates :user, :uniqueness => true
end
