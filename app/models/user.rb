class User < ActiveRecord::Base
  attr_accessible :count, :password, :user

  #user valiations, must be unique, length > 0 and <= 128
  validates :user, :uniqueness => true, :length => {:minimum => 1, :maximum => 128}
  #password validations, must be <= 128
  validates :password, :length => {:maximum => 128}
  #count validations, must be > 0
  validates :count, :numericality => { :greater_than_or_equal_to => 0 }
end
