require 'test_helper'

class UserTest < ActiveSupport::TestCase

  test "add user" do
  	usr = User.new(:user => "Andy", :password => "password", :count => 1234)
  	usr.save
  	retVal = User.find_by_user_and_password_and_count("Andy", "password", 1234)
  	assert retVal.user == "Andy" and retVal.password == "password" and retVal.count = 1234
  end

  test "add multiple users" do
  	User.new(:user => "Tester1", :password => "test1", :count => 1).save
  	User.new(:user => "Tester2", :password => "test2", :count => 2).save
  	tester1 = User.find_by_user_and_password_and_count("Tester1", "test1", 1)
  	tester2 = User.find_by_user_and_password_and_count("Tester2", "test2", 2)
  	assert tester1.user == 'Tester1' and tester1.password == "test1" and tester1.count == 1
  	assert tester2.user == 'Tester2' and tester2.password == "test2" and tester2.count == 2
  end

  test "unable add same users" do
  	User.new(:user => "Tester3", :password => "test3", :count => 3).save
  	failTester = User.new(:user => "Tester3", :password => "password", :count => 1)
  	assert failTester.save == false
  end

  test "unable add long username" do
  	longString = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
  	failUser = User.new(:user => longString, :password => "test", :count => 1)
  	assert failUser.save == false
  end

  test "unable add long password" do
  	longString = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
  	failUser = User.new(:user => "username", :password => longString, :count => 1)
  	assert failUser.save == false
  end

  test "unable to negative count" do
  	failUser = User.new(:user => "username", :password => "password", :count => -1)
  	assert failUser.save == false
  end

  test "able to add same passwords" do
  	User.new(:user => "Tester3", :password => "test", :count => 1).save
  	User.new(:user => "Tester4", :password => "test", :count => 2).save
  	tester1 = User.find_by_user_and_password_and_count("Tester3", "test", 1)
  	tester2 = User.find_by_user_and_password_and_count("Tester4", "test", 2)
  	assert tester1.user == 'Tester3' and tester1.password == "test" and tester1.count == 1
  	assert tester2.user == 'Tester4' and tester2.password == "test" and tester2.count == 2
  end

  test "unable to add empty user" do
  	usr = User.new(:user => "", :password => "password", :count => 1234)
  	assert usr.save == false
  end

  test "add zero length password" do
  	usr = User.new(:user => "Tester5", :password => "", :count => 1234)
  	usr.save
  	retVal = User.find_by_user_and_password_and_count("Tester5", "", 1234)
  	assert retVal.user == "Tester5" and retVal.password == "" and retVal.count = 1234
  end

  test "find by unique user" do
  	usr = User.new(:user => "Tester6", :password => "Tester6", :count => 1234)
  	usr.save
  	retVal = User.find_by_user("Tester6")
  	assert retVal.user == "Tester6" and retVal.password == "Tester6" and retVal.count = 1234
  end


end
